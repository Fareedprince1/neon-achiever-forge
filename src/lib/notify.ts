// Owner WhatsApp number (international format, no +)
export const OWNER_WHATSAPP = "916363425793";

// Open the owner's WhatsApp with a pre-filled lead notification.
// Opens in a new tab so the form submission UX is preserved.
export function notifyOwnerWhatsApp(message: string) {
  if (typeof window === "undefined") return;
  const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Public WhatsApp link for visitors (FAB / contact buttons).
export function visitorWhatsAppUrl(text = "Hi, I'd like to know more about Achiever Gym.") {
  return `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`;
}
