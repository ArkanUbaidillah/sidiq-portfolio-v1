-- ============================================================
-- PORTFOLIO MUHAMAD SIDIQ — SUPABASE SQL SCHEMA + RLS
-- Jalankan di: Supabase > SQL Editor > New Query
-- ============================================================

-- 1. COURSES (Mata Kuliah Praktikum)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public: read only
CREATE POLICY "courses_select_public"
  ON public.courses FOR SELECT
  USING (true);

-- Authenticated (Admin): full CRUD
CREATE POLICY "courses_insert_admin"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "courses_update_admin"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "courses_delete_admin"
  ON public.courses FOR DELETE
  TO authenticated
  USING (true);


-- 2. LAB_REPORTS (Laporan Praktikum dengan JSONB Blocks)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  week_number INTEGER,
  blocks      JSONB DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lab_reports_select_public"
  ON public.lab_reports FOR SELECT
  USING (true);

CREATE POLICY "lab_reports_insert_admin"
  ON public.lab_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "lab_reports_update_admin"
  ON public.lab_reports FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "lab_reports_delete_admin"
  ON public.lab_reports FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lab_reports_updated_at
  BEFORE UPDATE ON public.lab_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();


-- 3. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  tech_stack  TEXT[] DEFAULT '{}',
  github_url  TEXT,
  live_url    TEXT,
  image_path  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_public"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "projects_insert_admin"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "projects_update_admin"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "projects_delete_admin"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);


-- 4. CERTIFICATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.certificates (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title          TEXT NOT NULL,
  issuer         TEXT NOT NULL,
  issued_date    DATE,
  credential_url TEXT,
  image_path     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_select_public"
  ON public.certificates FOR SELECT
  USING (true);

CREATE POLICY "certificates_insert_admin"
  ON public.certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "certificates_update_admin"
  ON public.certificates FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "certificates_delete_admin"
  ON public.certificates FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================
-- 5. STORAGE BUCKETS — Buat juga lewat Supabase Dashboard
-- ============================================================
-- Buat 3 bucket berikut di Storage > New Bucket:
--   • projects       (Public)
--   • certificates   (Public)
--   • lab-reports    (Public)
--
-- Atau jalankan SQL ini (jika Supabase versi kamu mendukung):

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('projects',      'projects',      true),
  ('certificates',  'certificates',  true),
  ('lab-reports',   'lab-reports',   true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Allow public read, authenticated write
CREATE POLICY "storage_projects_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

CREATE POLICY "storage_projects_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'projects');

CREATE POLICY "storage_certs_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "storage_certs_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'certificates');

CREATE POLICY "storage_reports_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lab-reports');

CREATE POLICY "storage_reports_write"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'lab-reports');


-- ============================================================
-- 6. SAMPLE DATA (Opsional — untuk testing)
-- ============================================================

-- Sample course
INSERT INTO public.courses (name, slug, description)
VALUES
  ('Pemrograman Web', 'pemrograman-web', 'Praktikum mata kuliah Pemrograman Web'),
  ('Basis Data', 'basis-data', 'Praktikum mata kuliah Basis Data')
ON CONFLICT (slug) DO NOTHING;

-- Done! Semua tabel dan RLS sudah siap.
-- Selanjutnya: buat user admin lewat Supabase > Authentication > Users > Add User
