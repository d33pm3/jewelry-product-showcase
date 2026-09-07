import { useState } from "react";
import { inr, inr2, type Quote } from "@/components/PricingCalculator";

interface SubmittedQuote {
  ref: string;
  quote: Quote;
  submittedAt: string;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function quoteHtml(s: SubmittedQuote): string {
  const q = s.quote;
  const rows: Array<[string, string]> = [
    ["Piece", `${q.product.id} — ${q.product.name}`],
    ["Category", q.product.category],
    ["Material", q.product.material],
    ["Catalogue price", inr(q.product.price)],
    ["Weight per piece", `${q.grams} g (${q.carats.toFixed(2)} ct)`],
    ["Cost per gram", inr2(q.perGram)],
    ["Cost per carat", inr2(q.perCarat)],
    ["Quantity", String(q.qty)],
    ["Total weight", `${q.totalGrams.toFixed(2)} g (${q.totalCarats.toFixed(2)} ct)`],
    ["Subtotal", inr(q.subtotal)],
  ];
  if (q.gst) rows.push(["GST @ 3% (indicative)", inr(q.tax)]);
  rows.push(["Total", inr(q.total)]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#5b5244;border-bottom:1px solid #e8e0cf;">${escapeHtml(k)}</td><td style="padding:6px 12px;text-align:right;border-bottom:1px solid #e8e0cf;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Ornativa Quote ${s.ref}</title></head>
<body style="font-family:Georgia,'Times New Roman',serif;background:#faf6ec;color:#2e2a20;margin:0;padding:40px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #cbb26a;border-radius:18px;padding:32px;background:#fffdf6;">
    <h1 style="margin:0;font-size:22px;color:#3c4a2e;">Ornativa Jewels — Quote Summary</h1>
    <p style="margin:6px 0 20px;font-size:12px;color:#8a7a4f;">Reference ${escapeHtml(s.ref)} · ${escapeHtml(
      new Date(s.submittedAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }),
    )}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${rowsHtml}</table>
    <p style="margin:20px 0 0;font-size:11px;color:#8a7a4f;">Indicative pricing computed from the Ornativa catalogue extract. Final pricing is confirmed in studio. Demo only — no payment is collected.</p>
  </div>
</body></html>`;
}

export function QuoteSummary({ quote }: { quote: Quote | null }) {
  const [submitted, setSubmitted] = useState<SubmittedQuote | null>(null);

  if (!quote) return null;
  const q = quote;

  function onSubmit() {
    if (!q) return;
    const ref = `QT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setSubmitted({ ref, quote: q, submittedAt: new Date().toISOString() });
  }

  function download() {
    if (!submitted) return;
    const blob = new Blob([quoteHtml(submitted)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ornativa-quote-${submitted.ref}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function print() {
    if (!submitted) return;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(quoteHtml(submitted));
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => iframe.remove(), 1000);
    };
  }

  const stale =
    submitted &&
    (submitted.quote.product.id !== q.product.id ||
      submitted.quote.qty !== q.qty ||
      submitted.quote.gst !== q.gst);

  return (
    <section className="petal-corners gold-frame border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
      <h2 className="font-serif text-lg text-primary">Quote summary</h2>
      <p className="text-xs text-muted-foreground">
        Updates live as you adjust the calculator above.
      </p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-muted-foreground">Piece</dt>
          <dd className="text-right text-foreground">
            {q.product.id} — {q.product.name}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-muted-foreground">Quantity</dt>
          <dd className="text-foreground">{q.qty}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-muted-foreground">Subtotal</dt>
          <dd className="text-foreground">{inr(q.subtotal)}</dd>
        </div>
        {q.gst && (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-xs text-muted-foreground">GST @ 3%</dt>
            <dd className="text-foreground">{inr(q.tax)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-2">
          <dt className="text-xs text-muted-foreground">Total</dt>
          <dd className="font-serif text-lg text-primary">{inr(q.total)}</dd>
        </div>
      </dl>

      {!submitted || stale ? (
        <button
          type="button"
          onClick={onSubmit}
          className="mt-4 w-full rounded-full px-6 py-2.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-halo)] transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--gradient-gold)" }}
        >
          {stale ? "Resubmit updated quote" : "Submit quote"}
        </button>
      ) : null}

      {submitted && !stale && (
        <div className="mt-4 space-y-3">
          <p role="status" className="rounded-2xl border border-gold/50 bg-champagne/40 px-3.5 py-2.5 text-xs text-foreground">
            Quote submitted. Reference <strong>{submitted.ref}</strong> — download or print it below.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={download}
              className="rounded-full px-4 py-2 text-xs font-semibold text-gold-foreground shadow-[var(--shadow-halo)] transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--gradient-gold)" }}
            >
              Download quote
            </button>
            <button
              type="button"
              onClick={print}
              className="rounded-full border border-border px-4 py-2 text-xs hover:bg-secondary"
            >
              Print quote
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
