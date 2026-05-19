// Tiny client store for pre-selecting the Plan dropdown in the inquiry form.
const KEY = "preselectPlan";
export const PLAN_EVENT = "plan-preselect";

export function setPreselectPlan(plan: string) {
  try { sessionStorage.setItem(KEY, plan); } catch {}
  window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan }));
}

export function consumePreselectPlan(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    if (v) sessionStorage.removeItem(KEY);
    return v;
  } catch { return null; }
}

export function scrollToInquiry() {
  const el = document.getElementById("inquiry");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
