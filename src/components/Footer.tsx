import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="text-display text-3xl">ACHI<span className="neon-text">EVER</span></div>
            <p className="mt-3 text-muted-foreground max-w-xs">
              Achiever Gym — Forge Your Legacy. Train with intent. Live with power.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Quick Links" links={["Home", "About", "Coaches", "Gallery", "Inquiry"]} />
          <FooterCol title="Programs" links={["HIIT", "Strength", "Cardio", "Hypertrophy", "TRX"]} />
          <FooterCol title="Contact" links={["+91 98765 43210", "hello@achievergym.com", "Sector 12, Bengaluru"]} />
        </div>

        <div className="border-t border-border mt-12 pt-6 pb-20 sm:pb-6 sm:pr-24 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-muted-foreground">
          <div>© 2025 Achiever Gym · GST: 29XXXXX1234X1ZX</div>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-primary">Terms</Link>
            <Link to="/refund-policy" className="hover:text-primary">Refund Policy</Link>
            <Link to="/admin" className="hover:text-primary opacity-60">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-display text-lg mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-primary transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
