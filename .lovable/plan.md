## Problem

`gili@dmail.com` signs in successfully (toast appears), but `/admin/dashboard` shows a spinner forever. Verified in DB: that account already has the `admin` role, so the role check is not the issue — the async check itself is hanging silently with no visible error.

## Root cause (most likely)

`src/routes/admin.dashboard.tsx` uses `supabase.auth.getSession().then(async (...) => { await query })`. If either promise rejects, the `setState("ok")` branch never runs and there's no `.catch` — the spinner stays forever with no console error visible to the user. There's also no timeout / fallback.

## Fix (minimal, one file)

Edit only `src/routes/admin.dashboard.tsx`:

1. Convert the `useEffect` body to a single `async` function wrapped in `try/catch/finally`.
2. On any thrown error, `console.error` it and set state to `denied` (so we stop spinning).
3. Add a visible "denied" UI: short message + "Back to login" button (instead of silent `window.location.href` redirect that masks the issue).
4. Keep the `SIGNED_OUT` listener as-is.
5. Keep `window.location.href` redirects elsewhere — no other files touched.

This guarantees the spinner always resolves and surfaces the real error if the Supabase call fails.

## Out of scope

- No changes to `src/routes/admin.tsx` (login page works).
- No changes to `AdminShell`, footer, navbar, or any landing-page section.
- No DB migrations — admin role is already correct.
- No new dependencies.

## Files touched

- `src/routes/admin.dashboard.tsx` (one `useEffect` + add small "denied" return block)
