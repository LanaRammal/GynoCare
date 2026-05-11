
-- 1. Add patient_id to attachments for direct patient file uploads (not tied to a visit)
ALTER TABLE public.attachments ADD COLUMN patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE;
ALTER TABLE public.attachments ALTER COLUMN visit_id DROP NOT NULL;

-- 2. Create lab_test_templates table
CREATE TABLE public.lab_test_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  tests jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.lab_test_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own lab_test_templates" ON public.lab_test_templates FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Create billing_records table
CREATE TABLE public.billing_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  patient_id uuid NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_id uuid REFERENCES public.visits(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL DEFAULT 0,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage billing" ON public.billing_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Update attachments RLS to also allow patient_id based access
DROP POLICY IF EXISTS "Users manage own attachments" ON public.attachments;
CREATE POLICY "Users manage own attachments" ON public.attachments FOR ALL TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
