import type { Product } from "@/data/catalogue";

export function ProductCard({ product, onSelect }: { product: Product; onSelect?: (p: Product) => void }) {
  const oos = product.stock === "Out of Stock";
  return (
    <button
      type="button"
      onClick={() => onSelect?.(product)}
      className={`group leaf-corners gold-frame flex w-full flex-col overflow-hidden border border-border/70 bg-card text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-halo)] ${
        oos ? "opacity-70" : ""
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(closest-side, oklch(0.85 0.1 88 / 0.55), transparent 70%)" }}
        />
        <img
          src={product.image}
          alt={`${product.name} — ${product.id}`}
          width={768}
          height={768}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            oos ? "grayscale" : ""
          }`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg leading-tight text-primary">{product.name}</h3>
          <span className="rounded-full bg-champagne/60 px-2 py-0.5 font-mono text-[11px] tracking-wide text-accent-foreground">
            {product.id}
          </span>
        </div>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {product.category} · {product.material} · {product.weight}
        </p>
        <div className="wave-rule my-2 w-full opacity-70" />
        <div className="mt-auto flex items-center justify-between">
          <span className="font-serif text-lg text-foreground">{product.price}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${
              oos ? "bg-danger-soft text-ruby" : "bg-success-soft text-jade"
            }`}
          >
            {product.stock}
          </span>
        </div>
      </div>
    </button>
  );
}
