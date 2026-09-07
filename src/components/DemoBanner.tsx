import { DEMO_BANNER } from "@/lib/retrieval";

export function DemoBanner() {
  return (
    <div className="border-b border-border bg-secondary/70 px-4 py-2 text-center text-xs tracking-wide text-muted-foreground">
      {DEMO_BANNER}
    </div>
  );
}
