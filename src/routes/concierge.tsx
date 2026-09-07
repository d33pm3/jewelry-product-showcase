import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import {
  PricingCalculator,
  computeQuote,
  DEFAULT_QUOTE_INPUT,
  type QuoteInput,
} from "@/components/PricingCalculator";
import { QuoteSummary } from "@/components/QuoteSummary";
import { ConsultationForm } from "@/components/ConsultationForm";
import { CATALOGUE, byId } from "@/data/catalogue";
import { answerQuestion, GREETING, SAMPLE_QUESTIONS, type Turn } from "@/lib/retrieval";

const STORAGE_KEY = "ornativa-concierge-turns";
const MAX_TURNS = 6;

export const Route = createFileRoute("/concierge")({
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search["q"] === "string" ? { q: search["q"] } : {},
  head: () => ({
    meta: [
      { title: "Concierge — Ornativa Jewels Catalogue Assistant" },
      {
        name: "description",
        content:
          "Ask the Ornativa concierge about price, metal, weight and stock. Answers come only from the Ornativa Jewels catalogue extract.",
      },
      { property: "og:title", content: "Concierge — Ornativa Jewels Catalogue Assistant" },
      {
        property: "og:description",
        content: "A closed-book catalogue assistant for Ornativa Jewels, Hyderabad. No AI API, no invented prices.",
      },
    ],
  }),
  component: Concierge,
});

function Concierge() {
  const { q } = Route.useSearch();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [showCatalogue, setShowCatalogue] = useState(false);
  const [quoteInput, setQuoteInput] = useState<QuoteInput>(DEFAULT_QUOTE_INPUT);
  const quote = useMemo(() => computeQuote(quoteInput), [quoteInput]);
  const endRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setTurns(JSON.parse(raw) as Turn[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  function persist(next: Turn[]) {
    const trimmed = next.slice(-MAX_TURNS * 2);
    setTurns(trimmed);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      /* ignore */
    }
  }

  function send(text: string) {
    const question = text.trim();
    if (!question) return;
    setTurns((prev) => {
      const result = answerQuestion(question, prev);
      const userTurn: Turn = { role: "user", text: question };
      const botTurn: Turn = {
        role: "assistant",
        text: result.text,
        sources: result.sources,
        focus: result.focus,
      };
      const next: Turn[] = [...prev, userTurn, botTurn].slice(-MAX_TURNS * 2);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
    setInput("");
  }

  useEffect(() => {
    if (q && !seeded.current) {
      seeded.current = true;
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function clearConversation() {
    persist([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setTurns([]);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_360px]">
        <section className="petal-corners gold-frame flex min-h-[70vh] flex-col border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <h1 className="font-serif text-lg text-primary">Ornativa Concierge</h1>
              <p className="text-xs text-muted-foreground">Answers only from the Ornativa catalogue.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCatalogue((s) => !s)}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs hover:bg-secondary lg:hidden"
              >
                {showCatalogue ? "Hide" : "Catalogue"}
              </button>
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs hover:bg-secondary"
              >
                Clear conversation
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {turns.length === 0 && (
              <div className="leaf-corners bg-secondary/60 px-4 py-8 text-center">
                <p className="font-serif text-lg text-primary">{GREETING}</p>
              </div>
            )}
            {turns.map((t, i) => (
              <div key={i} className={t.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm ${
                    t.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "border border-border bg-background text-foreground rounded-bl-md gold-frame"
                  }`}
                >
                  {t.text}
                  {t.role === "assistant" && t.sources && t.sources.length > 0 && (
                    <p className="mt-2 border-t border-border pt-2 text-[11px] text-muted-foreground">
                      Sourced from{" "}
                      {t.sources
                        .map((id) => `${id} ${byId(id)?.name ?? ""}`.trim())
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-gold/50 bg-champagne/40 px-3.5 py-1.5 text-xs text-foreground transition-colors hover:bg-champagne/70"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a piece, a metal, a price…"
                className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-halo)] transition-transform hover:-translate-y-0.5" style={{ background: "var(--gradient-gold)" }}
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <aside className={`${showCatalogue ? "block" : "hidden"} space-y-6 lg:block`}>
          <PricingCalculator value={quoteInput} onChange={setQuoteInput} />
          <QuoteSummary quote={quote} />
          <ConsultationForm />
          <div className="petal-corners gold-frame border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
            <h2 className="font-serif text-lg text-primary">Catalogue</h2>
            <p className="text-xs text-muted-foreground">Tap a piece to ask about it.</p>
            <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              {CATALOGUE.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={(prod) => send(`Tell me about ${prod.name}`)} />
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
