## Admin Dashboard Overhaul Plan

Large multi-part change. I'll execute in this order so the database is ready before UI consumes it.

### Step 1 — Database migration (one call, requires your approval)
- `CREATE TABLE public.members` with all columns/constraints from your spec
- Enable RLS; policy: only users with `admin` role (using existing `has_role()` helper) can do anything — `auth.uid() IS NOT NULL` would let any logged-in user in, so I'll use `has_role(auth.uid(), 'admin')` to match the pattern of every other table in the project
- `updated_at` trigger using existing `update_updated_at_column()` pattern
- Seed the 10 members from your spec

### Step 2 — Remove Contact Queries
- Delete `src/routes/admin.dashboard.contact.tsx`
- Drop "Contact Queries" nav item from `AdminShell.tsx`
- Drop the contact card + `contact_queries` table from `Overview.tsx`; rearrange to your 2×3 grid (Leads Today / This Month / Pending → Free Trials / Memberships / Conversion Rate)
- Confirm homepage `InquiryForm.tsx` only writes to `membership_inquiries` (it already does — no dual-write to remove, will just verify)

### Step 3 — Homepage Free Trial form at `#trial`
- Build a real form section (Name, Phone, Goal, Batch, Claim button) that writes to `free_trial_requests` (existing table — has name/phone/goal/batch/status, no date column; I'll use `created_at` as the date rather than add a column)
- Wire the 3 hero/banner CTAs that currently scroll to `#inquiry` or open the modal to point to `#trial` instead
- Success toast: "Your free trial is confirmed! We'll call you shortly."

### Step 4 — Members page (the big one) at `/admin/dashboard/members`
- New route file `admin.dashboard.members.tsx`
- Add sidebar nav item with `IdCard` icon between Overview and Free Trials
- Components: stat cards (4), expiring banner, filter bar (search, plan, status, batch, date range, export, add), table with sort/pagination, status/days-left logic, row actions (call/WA/edit/delete with 5s undo)
- Add Member modal (zod-validated, duration → end date preview)
- Edit Member modal with: Activate/Deactivate toggle (separate from renewal), plan-card picker, duration buttons, renewal preview, payment fields, notes history
- Member detail side drawer (avatar by plan, timeline bar, quick actions, notes log + add note)
- Client-side display status (Active/Expiring Soon/Expired/Inactive) — DB status only changes on admin action, per your spec
- CSV export, WhatsApp templates URL-encoded

### Step 5 — Global UI polish
- Sidebar: GA avatar header, 220px width, neon-green hover border, logout confirmation dialog
- Top header: breadcrumb, bell with today's-new dropdown, search expand, GA avatar dropdown
- Table styles: alternating rows, sticky headers, hover border (applied via shared classes)
- Overview: clickable hover-scale cards, 7-day bar chart (using `recharts` — already in shadcn chart), recent activity feed (last 10 across tables)

### Step 6 — Per-page enhancements (Free Trials / Memberships / Schedule / Testimonials)
- Free Trials: email column, empty state, WA button, "Convert to Member →" prefills Add Member modal via sessionStorage
- Memberships: duplicate phone highlight, view details modal, reply modal, delete + undo
- Schedule: weekly 7-col grid, inline spots save, add-class modal, capacity summary
- Testimonials: warning on incomplete cards, rating/duration/plan in modal, drag-reorder (using `@dnd-kit/sortable` — already installed via shadcn), preview button

### Technical notes
- Reusing existing `has_role()` for RLS instead of `auth.uid() IS NOT NULL` (matches every other table — safer, your spec's policy would have allowed any authenticated user)
- Date pickers: using shadcn `Calendar` (already installed) inside `Popover` rather than adding Flatpickr as a new dep
- Icons: project uses `lucide-react`, not Tabler — I'll map `ti-*` to lucide equivalents (`IdCard`, `AlertTriangle`, `Phone`, `MessageCircle`, `Edit`, `Trash2`, `Bell`, `Search`, `Copy`, `UserPlus`, `FileText`)
- Charts: `recharts` (already in shadcn `chart.tsx`)
- Drag-reorder: `@dnd-kit/core` + `@dnd-kit/sortable` — install if missing
- All new server-side reads stay client-side via the existing browser supabase client (RLS gates admin access), consistent with current admin pages

### Scale & approach
This touches ~15 files and adds ~8 new ones. I'll implement in the order above, batching parallel edits where files are independent. Database migration goes first and waits for your approval before any code changes.

Approve to proceed.