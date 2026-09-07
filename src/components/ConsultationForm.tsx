import { useState } from "react";
import { z } from "zod";
import { CATALOGUE } from "@/data/catalogue";

const schema = z.object({
  name: z.string().trim().nonempty({ message: "Please enter your name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]{7,20}$/, { message: "Enter a valid phone number" }),
  productId: z.string().trim().nonempty({ message: "Choose a piece" }),
  date: z
    .string()
    .trim()
    .nonempty({ message: "Pick a preferred date" })
    .refine((d) => !d || d >= todayIso(), { message: "Date cannot be in the past" }),
  slot: z.string().trim().nonempty({ message: "Pick a time slot" }),
  notes: z.string().trim().max(500, { message: "Notes must be under 500 characters" }).optional(),
});

type Values = z.infer<typeof schema>;

const SLOTS = ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];
const STORAGE_KEY = "ornativa-consultation-requests";

function todayIso() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const empty: Values = {
  name: "",
  email: "",
  phone: "",
  productId: CATALOGUE[0]!.id,
  date: "",
  slot: "",
  notes: "",
};

export function ConsultationForm() {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [confirmation, setConfirmation] = useState<string | null>(null);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof Values, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setConfirmation(null);
      return;
    }
    setErrors({});
    const ref = `ORN-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as unknown[]) : [];
      list.push({ ref, ...parsed.data, createdAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
    const piece = CATALOGUE.find((p) => p.id === parsed.data.productId);
    const niceDate = new Date(`${parsed.data.date}T00:00:00`).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setConfirmation(
      `Thank you, ${parsed.data.name}. Your consultation for ${piece?.name ?? parsed.data.productId} on ${niceDate} at ${parsed.data.slot} is noted. Reference ${ref}. (Demo only — saved in this browser.)`,
    );
    setValues({ ...empty });
  }

  const field =
    "mt-1 w-full rounded-2xl border border-input bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";

  return (
    <section className="petal-corners gold-frame border border-border/70 bg-card p-4 shadow-[var(--shadow-card)]">
      <h2 className="font-serif text-lg text-primary">Book a consultation</h2>
      <p className="text-xs text-muted-foreground">
        Request an in-studio appointment with your preferred piece kept ready.
      </p>

      <form onSubmit={onSubmit} noValidate className="mt-4 space-y-3">
        <label className="block text-xs text-muted-foreground">
          Full name
          <input className={field} value={values.name} maxLength={100} onChange={(e) => set("name", e.target.value)} />
          <Err msg={errors.name} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-muted-foreground">
            Email
            <input className={field} type="email" value={values.email} maxLength={255} onChange={(e) => set("email", e.target.value)} />
            <Err msg={errors.email} />
          </label>
          <label className="block text-xs text-muted-foreground">
            Phone
            <input className={field} value={values.phone} maxLength={20} onChange={(e) => set("phone", e.target.value)} />
            <Err msg={errors.phone} />
          </label>
        </div>
        <label className="block text-xs text-muted-foreground">
          Preferred piece
          <select className={field} value={values.productId} onChange={(e) => set("productId", e.target.value)}>
            {CATALOGUE.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.name}
                {p.stock === "Out of Stock" ? " (out of stock)" : ""}
              </option>
            ))}
          </select>
          <Err msg={errors.productId} />
        </label>

        <label className="block text-xs text-muted-foreground">
          Preferred date
          <input
            className={field}
            type="date"
            min={todayIso()}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
          />
          <Err msg={errors.date} />
        </label>

        <fieldset className="text-xs text-muted-foreground">
          <legend className="mb-1">Preferred time</legend>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map((s) => {
              const active = values.slot === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("slot", s)}
                  className={
                    active
                      ? "rounded-full px-3.5 py-1.5 text-xs font-semibold text-gold-foreground shadow-[var(--shadow-halo)]"
                      : "rounded-full border border-gold/50 bg-champagne/40 px-3.5 py-1.5 text-xs text-foreground transition-colors hover:bg-champagne/70"
                  }
                  style={active ? { background: "var(--gradient-gold)" } : undefined}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <Err msg={errors.slot} />
        </fieldset>

        <label className="block text-xs text-muted-foreground">
          Notes (optional)
          <textarea
            className={field}
            rows={3}
            maxLength={500}
            value={values.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
          />
          <Err msg={errors.notes} />
        </label>

        <button
          type="submit"
          className="w-full rounded-full px-6 py-2.5 text-sm font-semibold text-gold-foreground shadow-[var(--shadow-halo)] transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--gradient-gold)" }}
        >
          Request consultation
        </button>
      </form>

      {confirmation && (
        <p role="status" className="mt-3 rounded-2xl border border-gold/50 bg-champagne/40 px-3.5 py-2.5 text-xs text-foreground">
          {confirmation}
        </p>
      )}
    </section>
  );
}

function Err({ msg }: { msg?: string | undefined }) {
  if (!msg) return null;
  return <span className="mt-1 block text-[11px] text-destructive">{msg}</span>;
}
