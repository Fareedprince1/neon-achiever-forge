import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  const msg = encodeURIComponent("Hi! I'm interested in joining Achiever Gym.");
  return (
    <a
      href={`https://wa.me/919876543210?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
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
