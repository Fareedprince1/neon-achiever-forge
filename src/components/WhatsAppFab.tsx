import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { visitorWhatsAppUrl } from "@/lib/notify";

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? window.scrollY / max : 0;
        setVisible(pct > 0.3);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <a
      href={visitorWhatsAppUrl("Hi! I'm interested in joining Achiever Gym.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-6 z-50 group transition-all duration-300 bottom-20 md:bottom-6 ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <span className="absolute inset-0 rounded-full animate-neon-pulse" />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors">
        <MessageCircle className="h-6 w-6" />
      </span>
      <span className="absolute right-16 top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap bg-card text-foreground text-xs px-3 py-2 rounded-md border border-border">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
