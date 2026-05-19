import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Schedule", href: "#schedule" },
  { label: "Coaches", href: "#coaches" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "FAQ", href: "#faq" },
  { label: "Inquiry", href: "#inquiry" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-background/70 backdrop-blur-md border-b border-border" : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-display text-2xl tracking-wide">
          ACHI<span className="neon-text">EVER</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "text-sm transition-colors duration-200 pb-1 border-b-2",
                  isActive
                    ? "text-primary border-primary"
                    : "text-foreground/80 border-transparent hover:text-primary"
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:flex">
          <Button asChild variant="neon" size="pill">
            <a href="#inquiry">Get 3 Days Free</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
          <div className="flex items-center justify-end px-4 py-2">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="container mx-auto max-w-7xl px-4 pb-6 flex flex-col">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "min-h-[48px] flex items-center text-base border-b border-border/60",
                    isActive ? "text-primary font-bold" : "text-foreground/90"
                  )}
                >
                  {l.label}
                </a>
              );
            })}
            <Button asChild variant="neon" size="pill" className="mt-4 self-start">
              <a href="#inquiry" onClick={() => setOpen(false)}>Get 3 Days Free</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
