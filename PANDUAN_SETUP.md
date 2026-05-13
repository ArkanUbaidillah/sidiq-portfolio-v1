# 🚀 Panduan Setup — Portfolio Muhamad Sidiq (Vercel Edition)

## Struktur Folder

```
sidiq-portfolio/
├── .github/workflows/deploy.yml   ← GitHub Actions → auto deploy ke Vercel
├── public/favicon.svg
├── vercel.json                     ← Fix routing React Router di Vercel ✅
├── src/
│   ├── components/admin/           ← AdminLayout, ProtectedRoute
│   ├── components/layout/          ← Navbar, Footer
│   ├── components/sections/        ← Hero, About, Projects, Praktikum, dst
│   ├── hooks/useAuth.js
│   ├── lib/supabase.js, emailjs.js
│   ├── pages/admin/                ← Login, Dashboard, Reports, Courses, dst
│   ├── pages/praktikum/            ← ReportDetail.jsx
│   ├── App.jsx, main.jsx, index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── SUPABASE_SCHEMA.sql
```

---

## STEP 1 — Instalasi & Jalankan Lokal

```bash
cd sidiq-portfolio
npm install
npm run dev
# → Buka http://localhost:5173
```

---

## STEP 2 — Setup Supabase

### 2A. Jalankan SQL Schema
1. Buka https://supabase.com/dashboard → pilih project
2. **SQL Editor → New Query**
3. Copy-paste seluruh isi `SUPABASE_SCHEMA.sql` → klik **Run**

### 2B. Buat Storage Buckets (jika SQL storage gagal)
Storage → New Bucket, buat 3 bucket dengan **Public = ON**:
- `projects`
- `certificates`
- `lab-reports`

### 2C. Buat Akun Admin
Authentication → Users → **Add User** → masukkan email + password

---

## STEP 3 — Deploy ke Vercel

### CARA 1 — Import dari GitHub (Termudah ✨)

```bash
# Push ke GitHub dulu
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/MSIDIQ472/portfolio.git
git branch -M main
git push -u origin main
```

1. Buka https://vercel.com/new
2. **Import Git Repository** → pilih repo kamu
3. Vercel deteksi Vite otomatis → klik **Deploy**
4. ~1 menit → website live! 🎉

> Setelah ini, setiap push ke `main` = auto re-deploy otomatis.

---

### CARA 2 — GitHub Actions (Lebih Kontrol)

#### A. Dapat Vercel Token
https://vercel.com/account/tokens → **Create Token** → copy

#### B. Dapat Org ID & Project ID
```bash
npm i -g vercel
vercel login
vercel          # jalankan di folder project, pilih N untuk tidak deploy
cat .vercel/project.json
# → {"projectId":"prj_xxx","orgId":"team_xxx"}
```

#### C. Tambah GitHub Secrets
Repo GitHub → Settings → Secrets → Actions → New secret:

| Secret Name         | Value                |
|---------------------|----------------------|
| `VERCEL_TOKEN`      | Token dari langkah A |
| `VERCEL_ORG_ID`     | orgId dari project.json |
| `VERCEL_PROJECT_ID` | projectId dari project.json |

#### D. Push → Auto Deploy
```bash
git push origin main
# → GitHub Actions build + deploy otomatis
```

---

## STEP 4 — Tambah Foto Profil

Di `src/components/sections/HeroSection.jsx`, ganti placeholder:

```jsx
// Sebelum:
<span className="font-display font-bold text-4xl text-emerald-400">MS</span>

// Sesudah (taruh foto di /public/foto-profil.jpg):
<img src="/foto-profil.jpg" alt="Muhamad Sidiq" className="w-full h-full object-cover" />
```

---

## STEP 5 — Pakai Admin CMS

- Login: `https://[domain].vercel.app/sidiq-admin`
- Alur: Tambah **Mata Kuliah** dulu → lalu buat **Laporan**
- Susun konten laporan dengan blok [Add Text] / [Add Heading] / [Upload Image] bebas
- Laporan live di: `/praktikum/[slug-matkul]/[slug-laporan]`

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Halaman /praktikum/... → 404 | Pastikan `vercel.json` ada di root project |
| Upload gambar gagal | Cek Storage bucket Public = ON |
| Login admin gagal | Cek user di Supabase → Authentication → Users |
| GitHub Actions gagal | Pastikan 3 VERCEL secrets sudah benar |
| Data tidak muncul | Buka DevTools Console → cek error Supabase RLS |
