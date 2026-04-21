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

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
