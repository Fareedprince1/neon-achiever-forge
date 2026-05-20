const PLANS = ["Basic", "Pro", "Elite"] as const;
const BATCHES = ["Morning", "Evening", "Weekend"] as const;
const PAY_MODES = ["Cash", "UPI", "Card", "Bank Transfer"] as const;

export type Plan = (typeof PLANS)[number];
export type Batch = (typeof BATCHES)[number];
export type PayMode = (typeof PAY_MODES)[number];

export const PLAN_PRICING: Record<Plan, { monthly: number; features: string[] }> = {
  Basic: { monthly: 999, features: ["Floor access", "Locker", "Basic equipment"] },
  Pro: { monthly: 1799, features: ["Group classes", "Diet plan", "Progress tracking"] },
  Elite: { monthly: 2999, features: ["All Pro perks", "Personal coach", "Unlimited access"] },
};

export const PLAN_COLORS: Record<Plan, { bg: string; text: string; ring: string }> = {
  Basic: { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/40" },
  Pro: { bg: "bg-blue-500/10", text: "text-blue-300", ring: "ring-blue-500/40" },
  Elite: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/40" },
};

export { PLANS, BATCHES, PAY_MODES };

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function fmtDate(d: string | Date): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function daysBetween(end: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);
  return Math.round((e.getTime() - today.getTime()) / 86400000);
}

export type DisplayStatus = "Active" | "Expiring Soon" | "Expired" | "Inactive";

export function displayStatus(dbStatus: string, endDate: string): DisplayStatus {
  if (dbStatus === "Inactive") return "Inactive";
  const d = daysBetween(endDate);
  if (d < 0) return "Expired";
  if (d <= 7) return "Expiring Soon";
  return "Active";
}

export function waLink(phone: string, msg: string): string {
  const p = phone.replace(/\D/g, "");
  const full = p.startsWith("91") ? p : `91${p}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}

export function expiringMessage(name: string, plan: string, endDate: string): string {
  return `Hi ${name}! Your ${plan} membership at Achiever Gym expires on ${fmtDate(endDate)}. Renew now to keep going! Reply or call us. — Team Achiever`;
}

export function expiredMessage(name: string, plan: string, endDate: string): string {
  return `Hi ${name}! Your ${plan} membership expired on ${fmtDate(endDate)}. We miss you! Special renewal offer available. Reply or call. — Team Achiever`;
}
