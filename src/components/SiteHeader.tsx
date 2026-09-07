import { Link } from "@tanstack/react-router";
import { DemoBanner } from "./DemoBanner";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md">
      <DemoBanner />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex items-center gap-3">
          <span className="disc-ring relative grid h-10 w-10 place-items-center">
            <span className="absolute inset-[3px] rounded-full bg-background/85" />
            <span className="relative font-serif text-base font-semibold text-primary">O</span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-xl font-semibold tracking-tight text-primary">Ornativa Jewels</span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Hyderabad · India</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/concierge"
            className="rounded-full px-4 py-1.5 text-foreground transition-colors hover:bg-secondary"
            activeProps={{ className: "rounded-full px-4 py-1.5 bg-primary text-primary-foreground font-medium" }}
          >
            Concierge
          </Link>
          <Link
            to="/catalogue"
            className="rounded-full px-4 py-1.5 text-foreground transition-colors hover:bg-secondary"
            activeProps={{ className: "rounded-full px-4 py-1.5 bg-primary text-primary-foreground font-medium" }}
          >
            Catalogue
          </Link>
        </nav>
      </div>
      <div className="braid-rule w-full" />
    </header>
  );
}
