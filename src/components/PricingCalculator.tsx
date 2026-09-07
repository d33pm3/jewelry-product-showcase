import { useMemo } from "react";
import { CATALOGUE, byId, type Product } from "@/data/catalogue";

const GRAMS_PER_CARAT = 0.2;

export function parseWeightGrams(weight: string): number {
  const match = weight.match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const inr2 = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

export interface QuoteInput {
  id: string;
  qty: number;
  gst: boolean;
}

export interface Quote {
  product: Product;
  qty: number;
  gst: boolean;
  grams: number;
  carats: number;
  perGram: number;
  perCarat: number;
  totalGrams: number;
  totalCarats: number;
  subtotal: number;
  tax: number;
  total: number;
}

export function computeQuote(input: QuoteInput): Quote | null {
  const product = byId(input.id);
  if (!product) return null;
  const grams = parseWeightGrams(product.weight);
  const carats = grams / GRAMS_PER_CARAT;
  const perGram = grams > 0 ? product.price / grams : 0;
  const perCarat = carats > 0 ? product.price / carats : 0;
  const subtotal = product.price * input.qty;
  const tax = input.gst ? subtotal * 0.03 : 0;
  return {
    product,
    qty: input.qty,
    gst: input.gst,
    grams,
    carats,
    perGram,
    perCarat,
    totalGrams: grams * input.qty,
    totalCarats: carats * input.qty,
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

export const DEFAULT_QUOTE_INPUT: QuoteInput = { id: CATALOGUE[0]!.id, qty: 1, gst: true };

export function PricingCalculator({
  value,
  onChange,
}: {
  value: QuoteInput;
  onChange: (next: QuoteInput) => void;
}) {
  const product = byId(value.id);
  const calc = useMemo(() => computeQuote(value), [value]);

  if (!product || !calc) return null;

  return (
    <section className="petal-corners gold-frame border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
      <h2 className="font-serif text-lg text-primary">Pricing calculator</h2>
      <p className="text-xs text-muted-foreground">
        Computed from the catalogue price and weight. 1 carat = 0.2 g.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted-foreground">
          Piece
          <select
            value={value.id}
            onChange={(e) => onChange({ ...value, id: e.target.value })}
            className="mt-1 w-full rounded-full border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            {CATALOGUE.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Quantity
          <input
            type="number"
            min={1}
            max={20}
            value={value.qty}
            onChange={(e) =>
              onChange({ ...value, qty: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })
            }
            className="mt-1 w-full rounded-full border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
        <Row label="Material" value={product.material} />
        <Row label="Catalogue price" value={inr(product.price)} />
        <Row label="Weight" value={`${calc.grams} g (${calc.carats.toFixed(2)} ct)`} />
        <Row label="Cost per gram" value={inr2(calc.perGram)} />
        <Row label="Cost per carat" value={inr2(calc.perCarat)} strong />
        <Row label={`Total weight (${value.qty}×)`} value={`${calc.totalGrams.toFixed(2)} g (${calc.totalCarats.toFixed(2)} ct)`} />
        <Row label="Subtotal" value={inr(calc.subtotal)} />
        {value.gst && <Row label="GST @ 3% (indicative)" value={inr(calc.tax)} />}
        <Row label="Total" value={inr(calc.total)} strong />
      </dl>

      <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={value.gst}
          onChange={(e) => onChange({ ...value, gst: e.target.checked })}
        />
        Include indicative 3% GST
      </label>

      {product.stock === "Out of Stock" && (
        <p className="mt-3 rounded-xl bg-secondary/70 px-3 py-2 text-xs text-foreground">
          {product.name} is currently out of stock — pricing shown for reference.
        </p>
      )}
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={strong ? "font-serif text-base text-primary" : "text-foreground"}>{value}</dd>
    </div>
  );
}
