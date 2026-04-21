import { useEffect, useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("terminal");

  useEffect(() => {
    const navIds = ["terminal", "about", "trajectory", "models", "network", "contact"];

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const marker = window.scrollY + 180;
      let current = navIds[0];

      navIds.forEach((id) => {
        const element = document.getElementById(id);

        if (element && element.offsetTop <= marker) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveSection(hash);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navLinks = [
    { name: "Terminal", href: "/#terminal", id: "terminal" },
    { name: "About", href: "/#about", id: "about" },
    { name: "Trajectory", href: "/#trajectory", id: "trajectory" },
    { name: "Models", href: "/#models", id: "models" },
    { name: "Network", href: "/#network", id: "network" },
    { name: "Contact", href: "/#contact", id: "contact" },
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
                  "relative py-1 text-sm font-mono tracking-tight transition-colors",
                  activeSection === link.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                )}
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
                className="border-b border-border/50 py-2 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                <span className={cn(activeSection === link.id ? "text-primary" : "text-foreground")}>{link.name}</span>
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
