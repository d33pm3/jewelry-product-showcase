import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { CATALOGUE } from "@/data/catalogue";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ornativa Concierge — Ask the Ornativa Jewels Catalogue" },
      {
        name: "description",
        content:
          "Ornativa Jewels, Hyderabad. Ask our offline concierge about price, metal, weight and stock for every piece in the official catalogue.",
      },
      { property: "og:title", content: "Ornativa Concierge — Ask the Ornativa Jewels Catalogue" },
      {
        property: "og:description",
        content: "A closed-book jewellery catalogue assistant for Ornativa Jewels, Hyderabad.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = CATALOGUE.slice(0, 4);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="solar-halo relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <span aria-hidden className="chevron-band absolute inset-0 opacity-40" />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-38%] h-[520px] w-[520px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.85 0.1 88 / 0.35), transparent 72%), conic-gradient(from 200deg, transparent 0deg, oklch(0.88 0.08 92 / 0.16) 10deg, transparent 22deg, transparent 34deg, oklch(0.88 0.08 92 / 0.14) 44deg, transparent 56deg)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
            <p className="text-[11px] uppercase tracking-[0.42em] text-gold">Ornativa Jewels · Hyderabad, India</p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-primary-foreground sm:text-6xl">
              Ask the catalogue.
              <span className="block text-gold-leaf">Get the fact.</span>
            </h1>
            <div className="braid-rule mx-auto mt-6 w-40" />
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-primary-foreground/80">
              Ornativa Concierge answers only from our official ten-piece catalogue — price, metal, weight and stock,
              never a guess.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/concierge"
                className="rounded-full px-7 py-3 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-halo)] transition-transform hover:-translate-y-0.5"
                style={{ background: "var(--gradient-gold)" }}
              >
                Open Concierge
              </Link>
              <Link
                to="/catalogue"
                className="rounded-full border border-gold/50 px-7 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                View catalogue
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-primary">From the counter</h2>
            <span className="wave-rule hidden h-2.5 flex-1 opacity-60 sm:block" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/catalogue"
                className="petal-corners gold-frame group overflow-hidden border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-halo)]"
              >
                <img
                  src={p.image}
                  alt={`${p.name} — ${p.id}`}
                  width={768}
                  height={768}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-3.5">
                  <p className="font-serif text-sm text-primary">{p.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {p.id} · {p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="hammered border-t border-border py-10 text-center text-xs tracking-[0.16em] text-muted-foreground uppercase">
        Ornativa Jewels — Hyderabad, India · Demo project, no transactions
      </footer>
    </div>
  );
}

