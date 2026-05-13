
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Status enum
CREATE TYPE public.lead_status AS ENUM ('new','called','converted','not_interested','read','resolved');

-- Free trial
CREATE TABLE public.free_trial_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  goal text,
  batch text,
  notes text,
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.free_trial_requests ENABLE ROW LEVEL SECURITY;

-- Contact
CREATE TABLE public.contact_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  notes text,
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_queries ENABLE ROW LEVEL SECURITY;

-- Membership inquiries
CREATE TABLE public.membership_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  plan text,
  goal text,
  batch text,
  message text,
  notes text,
  status public.lead_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.membership_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can INSERT only
CREATE POLICY "public submit free trial" ON public.free_trial_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public submit contact" ON public.contact_queries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "public submit membership" ON public.membership_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Admin full access
CREATE POLICY "admin all free trial" ON public.free_trial_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all contact" ON public.contact_queries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin all membership" ON public.membership_inquiries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX ON public.free_trial_requests (created_at DESC);
CREATE INDEX ON public.contact_queries (created_at DESC);
CREATE INDEX ON public.membership_inquiries (created_at DESC);
