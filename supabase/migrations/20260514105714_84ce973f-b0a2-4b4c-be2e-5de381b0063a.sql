
-- class_schedule table
CREATE TABLE public.class_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day text NOT NULL,
  time text NOT NULL,
  class_name text NOT NULL,
  trainer text NOT NULL,
  duration text NOT NULL,
  spots_left integer NOT NULL DEFAULT 10,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read class_schedule" ON public.class_schedule FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage class_schedule" ON public.class_schedule FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- testimonials table
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  member_image text,
  quote text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  duration text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read active testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "admin manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER TABLE public.free_trial_requests REPLICA IDENTITY FULL;
ALTER TABLE public.contact_queries REPLICA IDENTITY FULL;
ALTER TABLE public.membership_inquiries REPLICA IDENTITY FULL;
ALTER TABLE public.class_schedule REPLICA IDENTITY FULL;
ALTER TABLE public.testimonials REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.free_trial_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_queries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.membership_inquiries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;

-- Seed class schedule (default same rows for each day)
INSERT INTO public.class_schedule (day, time, class_name, trainer, duration, spots_left, sort_order) VALUES
('Mon','6:00 AM','HIIT Burn','Alex Power','45 min',8,1),
('Mon','8:00 AM','Strength Build','Logan Steel','60 min',5,2),
('Mon','10:00 AM','Mobility Flow','Priya Sharma','40 min',10,3),
('Mon','6:00 PM','Zumba','Maya Cruz','45 min',12,4),
('Mon','7:00 PM','Hypertrophy','Logan Steel','60 min',6,5),
('Mon','8:00 PM','Yoga & Stretch','Priya Sharma','30 min',15,6),
('Tue','6:00 AM','HIIT Burn','Alex Power','45 min',8,1),
('Tue','8:00 AM','Strength Build','Logan Steel','60 min',5,2),
('Tue','6:00 PM','Zumba','Maya Cruz','45 min',12,3),
('Tue','7:00 PM','Hypertrophy','Logan Steel','60 min',6,4),
('Wed','6:00 AM','HIIT Burn','Alex Power','45 min',8,1),
('Wed','8:00 AM','Strength Build','Logan Steel','60 min',5,2),
('Wed','6:00 PM','Zumba','Maya Cruz','45 min',12,3),
('Wed','7:00 PM','Hypertrophy','Logan Steel','60 min',6,4),
('Thu','6:00 AM','HIIT Burn','Alex Power','45 min',8,1),
('Thu','8:00 AM','Strength Build','Logan Steel','60 min',5,2),
('Thu','6:00 PM','Zumba','Maya Cruz','45 min',12,3),
('Thu','7:00 PM','Hypertrophy','Logan Steel','60 min',6,4),
('Fri','6:00 AM','HIIT Burn','Alex Power','45 min',8,1),
('Fri','8:00 AM','Strength Build','Logan Steel','60 min',5,2),
('Fri','6:00 PM','Zumba','Maya Cruz','45 min',12,3),
('Fri','7:00 PM','Hypertrophy','Logan Steel','60 min',6,4),
('Sat','8:00 AM','Strength Build','Logan Steel','60 min',5,1),
('Sat','10:00 AM','Mobility Flow','Priya Sharma','40 min',10,2),
('Sat','5:00 PM','Zumba','Maya Cruz','45 min',12,3),
('Sun','9:00 AM','Yoga & Stretch','Priya Sharma','30 min',15,1),
('Sun','11:00 AM','HIIT Burn','Alex Power','45 min',8,2);

-- Seed testimonials
INSERT INTO public.testimonials (member_name, quote, rating, duration, is_active, sort_order) VALUES
('Sneha R.','The coaches push me beyond limits I never thought I had. My energy is unmatched.',5,'Member · 2 yrs',true,1),
('Arjun T.','Cleanest equipment and the most welcoming community. Achiever feels like home.',5,'Member · 1 yr',true,2),
('Priya N.','Lost 12kg, gained confidence and made lifelong friends. Worth every rupee.',5,'Member · 8 mo',true,3),
('Karan V.','Programming is elite. I went from skinny to strong in under a year.',5,'Member · 3 yrs',true,4);
