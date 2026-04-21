import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Terminal", href: "/#terminal" },
    { name: "Trajectory", href: "/#trajectory" },
    { name: "Models", href: "/#models" },
    { name: "Pricer", href: "/#pricer" },
    { name: "Network", href: "/#network" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "px-3 pt-3"
          : "px-3 pt-5"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center justify-between gap-6 rounded-[28px] border border-white/5 px-5 py-5 shadow-2xl transition-all duration-300 md:px-7",
          scrolled
            ? "bg-background/85 backdrop-blur-xl"
            : "bg-background/70 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between w-full gap-6">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/15 group-hover:border-primary/50 transition-colors">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display font-bold text-[1.1rem] tracking-tight text-foreground group-hover:text-primary transition-colors">
              PORTFOLIO<span className="text-primary">.FN</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-mono tracking-tight cursor-pointer transition-colors relative py-1 text-muted-foreground hover:text-foreground"
                )}
              >
                <div>
                  {link.name}
                  {location === "/" && link.href === "/#terminal" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  )}
                </div>
              </a>
            ))}
            <a
              href="/Dhiren_Rawal_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-[126px] rounded-[18px] border border-primary/40 bg-primary/10 px-5 py-3 text-center text-base font-bold text-primary transition-colors hover:bg-primary/15"
            >
              Resume
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-3 pt-3 animate-in slide-in-from-top-5">
          <div className="mx-auto max-w-[1280px] rounded-[24px] border border-white/5 bg-background/90 backdrop-blur-xl px-5 py-6 flex flex-col gap-4 shadow-2xl">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-medium py-2 border-b border-border/50 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className="text-lg font-medium py-2 border-b border-border/50 cursor-pointer"
                >
                  <span className="text-foreground">
                    {link.name}
                  </span>
                </div>
              </a>
            ))}
            <a
              href="/Dhiren_Rawal_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-center font-bold text-primary"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
