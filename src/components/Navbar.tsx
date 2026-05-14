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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-foreground/80 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Button asChild variant="neon" size="pill">
            <a href="#trial">Get 3 Days Free</a>
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/90 py-1"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="neon" size="pill" className="mt-2 self-start">
              <a href="#trial" onClick={() => setOpen(false)}>Get 3 Days Free</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
