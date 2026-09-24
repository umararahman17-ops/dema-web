-- ===================================================================
-- SQL SCRIPT UNTUK DATABASE DEMA WEB (SUPABASE)
-- Salin dan jalankan script ini di SQL Editor Supabase Anda:
-- https://supabase.com/dashboard/project/vszazkjezdeqnhwqddfw/sql/new
-- ===================================================================

-- 1. Buat Tabel program_kerja
CREATE TABLE IF NOT EXISTS public.program_kerja (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'sains-teknologi',
  category_name TEXT DEFAULT 'Sains & Teknologi',
  date TEXT DEFAULT 'Segera Datang',
  status TEXT DEFAULT 'Sukses Terlaksana',
  "desc" TEXT DEFAULT '',
  impact TEXT DEFAULT '-',
  image TEXT DEFAULT 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  tags JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Aktifkan Keamanan Row Level Security (RLS)
ALTER TABLE public.program_kerja ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Baca: Siapa saja (pengunjung umum) dapat membaca data
DROP POLICY IF EXISTS "Izinkan baca publik" ON public.program_kerja;
CREATE POLICY "Izinkan baca publik"
ON public.program_kerja
FOR SELECT
TO anon, authenticated
USING (true);

-- 4. Kebijakan Tulis: Izinkan insert/update/delete (keamanan admin diverifikasi di Next.js)
DROP POLICY IF EXISTS "Izinkan kelola data" ON public.program_kerja;
CREATE POLICY "Izinkan kelola data"
ON public.program_kerja
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. Masukkan Data Awal (6 Program Kerja)
INSERT INTO public.program_kerja (id, slug, title, category, category_name, date, status, "desc", impact, image, tags, featured)
VALUES
  (
    1,
    'expo',
    'EXPO',
    'sains-teknologi',
    'Sains & Teknologi',
    '15-18 Mei 2026',
    'Sukses Terlaksana',
    'Pameran inovasi dan riset teknologi mahasiswa berskala nasional dengan 80+ prototipe karya teknologi mutakhir, IoT, kecerdasan buatan, serta kompetisi ilmiah.',
    '1.500+ Pengunjung • 25 Tim Finalis • 6 Paten/HKI Terbantu',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    '["Expo", "IoT", "AI", "Riset"]'::jsonb,
    true
  ),
  (
    2,
    'dema-mengabdi-desa-digital',
    'DEMA Mengabdi: Transformasi Digital Desa',
    'sosial-pengabdian',
    'Sosial & Pengabdian',
    '20-27 Juli 2026',
    'Sukses Terlaksana',
    'Program pengabdian masyarakat terintegrasi yang menghadirkan sistem administrasi desa berbasis website, pelatihan literasi internet sehat, dan digitalisasi UMKM lokal.',
    '3 Desa Binaan • 45 UMKM Terdigitalisasi • 300+ Warga Terlatih',
    'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
    '["Pengabdian", "Desa Digital", "UMKM"]'::jsonb,
    true
  ),
  (
    3,
    'leadership-tech-bootcamp',
    'National Student Leadership & Tech Bootcamp',
    'kaderisasi',
    'Kaderisasi & Karir',
    '10-12 Maret 2026',
    'Sukses Terlaksana',
    'Kaderisasi kepemimpinan tingkat lanjut bagi aktivis mahasiswa dengan fokus pada manajemen organisasi modern, diplomasi, problem solving berbasis data, dan adaptasi era AI.',
    '350 Peserta Terpilih • 12 Mentor Eksekutif & Praktisi',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    '["Leadership", "Bootcamp", "Manajemen"]'::jsonb,
    true
  ),
  (
    4,
    'hackathon-ai-green-solutions',
    'Hackathon: Green Tech & AI Climate Solutions',
    'sains-teknologi',
    'Sains & Teknologi',
    '2-4 Agustus 2026',
    'Sukses Terlaksana',
    'Kompetisi coding 36 jam nonstop untuk merancang solusi komputasi cerdas dalam mitigasi krisis iklim, manajemen energi terbarukan, dan zero-waste kampus.',
    '42 Tim Pengembang • Rp 40 Juta Total Hibah Dana Riset',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    '["Hackathon", "AI", "Sustainability"]'::jsonb,
    true
  ),
  (
    5,
    'advokasi-terpadu-kesejahteraan-mahasiswa',
    'Advokasi Terpadu & Forum Dengar Suara',
    'advokasi',
    'Advokasi Mahasiswa',
    'Setiap Bulan (Berkala)',
    'Program Berjalan',
    'Kanal advokasi terbuka dan pendampingan bantuan banding UKT, sarana laboratorium, dan beasiswa darurat untuk menjamin tidak ada rekan mahasiswa yang putus kuliah.',
    '100% Aduan Masuk Ditindaklanjuti • 180+ Penerima Beasiswa Advokasi',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    '["Advokasi", "Beasiswa", "UKT"]'::jsonb,
    true
  ),
  (
    6,
    'festival-seni-kreatif-sains',
    'Art & Science Fusion Festival 2026',
    'seni-kreatif',
    'Kreatif & Seni',
    '28-29 September 2026',
    'Segera Datang',
    'Kolaborasi spektakuler antara sains komputasi dan instalasi seni interaktif multimedia yang mengeksplorasi estetika fraktal, musik algoritmis, dan teater kontemporer.',
    'Target 2.000 Apresian • 15 Komunitas Seni Kolaborator',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    '["Art & Science", "Festival", "Seni"]'::jsonb,
    true
  )
ON CONFLICT (id) DO UPDATE 
SET 
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  date = EXCLUDED.date,
  status = EXCLUDED.status,
  "desc" = EXCLUDED."desc",
  impact = EXCLUDED.impact,
  image = EXCLUDED.image,
  tags = EXCLUDED.tags,
  featured = EXCLUDED.featured,
  updated_at = NOW();

-- Sesuaikan auto-increment sequence ke ID tertinggi berikutnya
SELECT setval(pg_get_serial_sequence('program_kerja', 'id'), COALESCE(MAX(id), 1)) FROM public.program_kerja;
