import { CATALOGUE, type Product } from "@/data/catalogue";

export interface Turn {
  role: "user" | "assistant";
  text: string;
  focus?: string[];
  sources?: string[];
}

export interface AnswerResult {
  text: string;
  sources: string[];
  focus: string[];
}

const REFUSAL =
  "That is not in the Ornativa catalogue I have. Please visit or message the Hyderabad store and the team will confirm.";

const OUT_OF_SCOPE = [
  "rolex",
  "tanishq",
  "kalyan",
  "malabar",
  "cartier",
  "watch",
  "discount",
  "% off",
  "percent off",
  "offer",
  "deal",
  "buyback",
  "buy back",
  "exchange rate",
  "making charge",
  "hallmark",
  "certificat",
  "custom design",
  "customis",
  "customiz",
  "restock",
  "emi",
  "delivery",
  "shipping",
  "gst",
  "warranty",
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+.\s]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (s: string) => norm(s).split(" ").filter(Boolean);

const STOP = new Set([
  "the","a","an","is","of","for","me","show","list","all","what","whats","which","products","product",
  "item","items","do","you","have","tell","about","price","cost","much","how","are","made","in","and",
  "can","i","buy","today","it","its","that","this","please","give","any","there","available","stock",
]);

type Field = "price" | "weight" | "material" | "stock" | "category" | null;

function detectField(q: string): Field {
  if (/\b(price|cost|rate|kitna|kitne)\b/.test(q)) return "price";
  if (/\b(weight|grams?|gm|g)\b/.test(q)) return "weight";
  if (/\b(material|metal|karat|carat|made of)\b/.test(q)) return "material";
  if (/\b(stock|available|availability|buy|purchase|in stock)\b/.test(q)) return "stock";
  if (/\bcategory\b/.test(q)) return "category";
  return null;
}

function fmtLine(p: Product) {
  return `${p.id} — ${p.name} · ${p.category} · ${p.material} · ${p.weight} · ${p.price} · ${p.stock}`;
}

function details(p: Product) {
  return [
    `${p.name} (${p.id})`,
    `Category: ${p.category}`,
    `Material: ${p.material}`,
    `Weight: ${p.weight}`,
    `Price: ${p.price}`,
    `Stock: ${p.stock}`,
  ].join("\n");
}

function alternativeFor(p: Product) {
  return CATALOGUE.find((o) => o.category === p.category && o.stock === "Available" && o.id !== p.id);
}

function oosSentence(p: Product) {
  const alt = alternativeFor(p);
  return alt
    ? `${p.name} is currently out of stock. You may like the ${alt.name} instead.`
    : `${p.name} is currently out of stock.`;
}

interface Filters {
  materials: string[];
  category?: Product["category"] | undefined;
  stock?: Product["stock"] | undefined;
}

function detectFilters(q: string): Filters {
  const materials: string[] = [];
  if (/\bdiamonds?\b/.test(q)) materials.push("Diamond");
  if (/\brub(y|ies)\b/.test(q)) materials.push("Ruby");
  if (/\bemeralds?\b/.test(q)) materials.push("Emerald");
  if (/\bpearls?\b/.test(q)) materials.push("Pearl");
  if (/\b22\s?k\b/.test(q)) materials.push("22K");
  if (/\b18\s?k\b/.test(q)) materials.push("18K");

  let category: Product["category"] | undefined;
  if (/\brings?\b/.test(q)) category = "Ring";
  else if (/\b(necklaces?|chokers?)\b/.test(q)) category = "Necklace";
  else if (/\bearrings?|studs?\b/.test(q)) category = "Earrings";
  else if (/\bbracelets?|cuffs?\b/.test(q)) category = "Bracelet";
  else if (/\bpendants?\b/.test(q)) category = "Pendant";

  let stock: Product["stock"] | undefined;
  if (/\bout of stock|unavailable|sold out\b/.test(q)) stock = "Out of Stock";
  else if (/\bavailable|in stock\b/.test(q)) stock = "Available";

  return { materials, category, stock };
}

function matchByName(q: string): Product | null {
  const qt = tokens(q);
  const idHit = CATALOGUE.find((p) => qt.includes(p.id.toLowerCase()));
  if (idHit) return idHit;

  let best: Product | null = null;
  let bestScore = 0;
  for (const p of CATALOGUE) {
    const nameTokens = tokens(p.name).filter((t) => !STOP.has(t));
    const score = nameTokens.filter((t) => qt.includes(t)).length;
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return bestScore >= 2 ? best : null;
}

function fieldAnswer(p: Product, field: Field): string {
  switch (field) {
    case "price":
      return `${p.name} (${p.id}) is priced at ${p.price}.`;
    case "weight":
      return `${p.name} (${p.id}) weighs ${p.weight}.`;
    case "material":
      return `${p.name} (${p.id}) is made of ${p.material}.`;
    case "category":
      return `${p.name} (${p.id}) is in the ${p.category} category.`;
    case "stock":
      return p.stock === "Available"
        ? `${p.name} (${p.id}) is Available. Price ${p.price}, ${p.material}, ${p.weight}.`
        : oosSentence(p);
    default:
      return details(p);
  }
}

export function answerQuestion(query: string, history: Turn[]): AnswerResult {
  const q = norm(query);
  if (!q) {
    return { text: "Please type a question about our catalogue.", sources: [], focus: [] };
  }

  if (OUT_OF_SCOPE.some((k) => q.includes(k)) && !matchByName(q)) {
    return { text: REFUSAL, sources: [], focus: [] };
  }

  const field = detectField(q);
  const filters = detectFilters(q);

  // 1) Direct product match by id or name
  const named = matchByName(q);
  if (named) {
    let text = fieldAnswer(named, field);
    if (named.stock === "Out of Stock" && field !== "stock") {
      text += `\n${oosSentence(named)}`;
    }
    return { text, sources: [named.id], focus: [named.id] };
  }

  // 2) Follow-up: reuse last focus when the query adds no new material/stock filter
  const lastFocus = [...history].reverse().find((t) => t.focus && t.focus.length)?.focus ?? [];
  if (lastFocus.length && filters.materials.length === 0 && !filters.stock) {
    let scoped = CATALOGUE.filter((p) => lastFocus.includes(p.id));
    if (filters.category) scoped = scoped.filter((p) => p.category === filters.category);
    const only = scoped[0];
    if (scoped.length === 1 && only) {
      const p = only;
      let text = fieldAnswer(p, field);
      if (p.stock === "Out of Stock" && field !== "stock") text += `\n${oosSentence(p)}`;
      return { text, sources: [p.id], focus: [p.id] };
    }
    if (filters.category && scoped.length > 1) {
      return listAnswer(scoped, field, `From the items we just discussed`);
    }
  }

  // 3) Filtered list
  if (filters.materials.length || filters.category || filters.stock) {
    let rows = CATALOGUE;
    for (const m of filters.materials) rows = rows.filter((p) => p.material.includes(m));
    if (filters.category) rows = rows.filter((p) => p.category === filters.category);
    if (filters.stock) rows = rows.filter((p) => p.stock === filters.stock);

    if (rows.length === 0) return { text: REFUSAL, sources: [], focus: [] };
    const single = rows[0];
    if (rows.length === 1 && single) {
      const p = single;
      let text = fieldAnswer(p, field);
      if (p.stock === "Out of Stock" && field !== "stock") text += `\n${oosSentence(p)}`;
      return { text, sources: [p.id], focus: [p.id] };
    }
    return listAnswer(rows, field, "Here is what the catalogue has");
  }

  // 4) Whole catalogue request
  if (/\b(catalogue|catalog|everything|all products|show all)\b/.test(q)) {
    return listAnswer(CATALOGUE, field, "Our full catalogue");
  }

  return { text: REFUSAL, sources: [], focus: [] };
}

function listAnswer(rows: Product[], field: Field, lead: string): AnswerResult {
  const lines = rows.map((p) => {
    if (field === "price") return `${p.id} — ${p.name} · ${p.price} · ${p.stock}`;
    if (field === "weight") return `${p.id} — ${p.name} · ${p.weight} · ${p.stock}`;
    return fmtLine(p);
  });
  const oos = rows.filter((p) => p.stock === "Out of Stock");
  const extra = oos.map((p) => oosSentence(p));
  return {
    text: [`${lead} (${rows.length}):`, ...lines, ...extra].join("\n"),
    sources: rows.map((p) => p.id),
    focus: rows.map((p) => p.id),
  };
}

export const SAMPLE_QUESTIONS = [
  "List all available diamond items.",
  "What is the price of the Pearl Necklace?",
  "Which products are made of 22K gold?",
  "Show me diamond products.",
  "Can I buy the Ruby Solitaire Ring today?",
];

export const GREETING =
  "Welcome to Ornativa Jewels, Hyderabad. Ask about anything in our catalogue.";

export const DEMO_BANNER =
  "Offline demo — answers from the Ornativa catalogue extract. Not connected to an AI API.";
