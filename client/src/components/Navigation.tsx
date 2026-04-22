import { useEffect, useState } from "react";
import { Menu, Terminal, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Terminal", href: "/#home" },
  { name: "Trajectory", href: "/#experience" },
  { name: "Models", href: "/#projects" },
  { name: "Pricer", href: "/#pricer" },
  { name: "Network", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

const NEW_YORK_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const NEW_YORK_PARTS_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function getMarketClock() {
  const parts = Object.fromEntries(
    NEW_YORK_PARTS_FORMATTER.formatToParts(new Date())
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const weekday = parts.weekday ?? "Mon";
  const hour = Number(parts.hour ?? "0");
  const minute = Number(parts.minute ?? "0");
  const currentMinutes = hour * 60 + minute;
  const isWeekday = weekday !== "Sat" && weekday !== "Sun";
  const isOpen = isWeekday && currentMinutes >= 9 * 60 + 30 && currentMinutes < 16 * 60;

  return {
    isOpen,
    time: NEW_YORK_TIME_FORMATTER.format(new Date()),
  };
}

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [marketClock, setMarketClock] = useState(() => getMarketClock());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setMarketClock(getMarketClock()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/50 bg-background/85 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/#home" className="group flex shrink-0 items-center gap-2">
            <div className="rounded bg-primary/10 p-1.5 transition-colors group-hover:bg-primary/20">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              PORTFOLIO<span className="text-primary">.FN</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="font-mono text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="min-w-[188px] rounded-[18px] border border-white/10 bg-[#08111d]/88 px-4 py-2 shadow-[0_10px_26px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <div className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.26em] ${marketClock.isOpen ? "text-primary" : "text-amber-300"}`}>
                <span className={`h-2 w-2 rounded-full ${marketClock.isOpen ? "animate-pulse bg-primary" : "bg-amber-300"}`} />
                {marketClock.isOpen ? "MKT OPEN" : "MKT CLOSED"} · EST
              </div>
              <div className="mt-1 font-mono text-[1.02rem] font-semibold leading-none tracking-[0.08em] text-white tabular-nums">
                {marketClock.time}
              </div>
            </div>
            <a
              href="/Dhiren_Rawal_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-8 items-center justify-center rounded-md border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground shadow-[0_0_24px_rgba(0,255,136,0.25)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,255,136,0.42)]"
            >
              Resume
            </a>
          </div>

          <button type="button" className="p-2 text-foreground md:hidden" onClick={() => setOpen((current) => !current)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="absolute w-full border-b border-border bg-background px-4 pb-4 shadow-xl md:hidden">
          <div className="mt-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md p-2 font-mono text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-primary"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/Dhiren_Rawal_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-10 items-center justify-center rounded-md border border-primary bg-primary px-4 font-medium text-primary-foreground"
            >
              Resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
