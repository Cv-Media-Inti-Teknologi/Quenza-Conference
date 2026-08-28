# PRD: Quenza Conference System

## Ringkasan
Platform manajemen konferensi akademik terintegrasi berbasis AI, menggantikan proses manual (Google Form/Excel/email) untuk pendaftaran, submission paper, review, penjadwalan, dan keuangan. Dibangun di atas base code **Oceri** (Laravel & React).

## Tujuan
- Single source of truth untuk seluruh siklus konferensi.
- Admin bisa kelola landing page tanpa bantuan IT.
- Alur review paper ketat & akademis (setara OJS/EDAS), double-blind.
- Auto-scheduling ruangan bebas bentrok (AI).
- Visibilitas keuangan real-time (income vs expense).

## Batasan Teknis (Wajib Diikuti)
- Backend: **PHP (Laravel)**, base code eksisting Oceri — bukan dari nol.
- Database: **SQLite**.
- Kontainerisasi: **Docker**.
- Frontend: React + **Tailwind CSS**; JS terbatas pada **jQuery/Alpine.js** (bukan SPA berat seperti React/Vue full app, meskipun disebut React di base code Oceri — konfirmasi ke tim jika ada konflik).
- Skala: ±800 peserta, 300–500 paper accepted, hingga 10 sesi paralel bersamaan.

## Batasan Bisnis
- Sistem tertutup (closed system): hanya panitia, author, reviewer, peserta terdaftar.
- **Tidak ada** fitur publikasi paper untuk publik (non-negotiable).
- Satu konferensi per instalasi (multi-tenant di luar cakupan).

## User Roles
1. **Super Admin** — kelola CMS, keuangan, penjadwalan, assign reviewer.
2. **Reviewer** — menilai naskah (double-blind), lihat skor similarity AI.
3. **Author/Presenter** — submit paper bertahap, bayar registrasi, lihat jadwal.
4. **Participant** — beli tiket, lihat jadwal sesi, dapat e-sertifikat.

## Modul & Fitur Utama (Must-have prioritas tinggi)

**A. CMS & Landing Page**
- Admin edit konten (speaker, sponsor, harga, banner) tanpa ubah kode.

**B. Manajemen Paper & Review**
- Alur bertahap: Abstract → Full Paper → Camera Ready (state machine, guard validation).
- Double-blind review: reviewer tidak lihat identitas author & sebaliknya.
- Admin assign reviewer manual; AI rekomendasi reviewer (cosine similarity abstrak vs expertise_tags).
- AI deteksi similarity/plagiarisme saat upload.
- Status paper real-time untuk author.
- Export ZIP naskah accepted (bulk, max ~5 menit untuk 500 paper).

**C. Event & Penjadwalan**
- Kelola ruangan (kapasitas, lokasi) & jadwal sesi paralel per hari.
- AI auto-scheduling: no double-booking presenter, no over-kapasitas ruangan.
- Admin bisa adjust manual (drag-and-drop) sebelum publish.
- Mode hybrid (offline + link virtual).

**D. Keuangan & Pembayaran**
- Payment Gateway (Virtual Account & QRIS) via webhook → status PENDING → PAID otomatis.
- Auto-expire transaksi jika lewat batas waktu (24 jam).
- Pencatatan income non-tiket (sponsorship, hibah) & expense (kategori, nominal, bukti).
- Dashboard Laba-Rugi real-time (Gross Income, Total Expense, Net Balance).
- Refund management (status: Requested/Processed/Completed).
- Invoice PDF otomatis via email setelah pembayaran sukses.
- Export laporan keuangan (Excel/PDF, filter tanggal).

**E. Quenza AI Assistant**
- Reviewer matching, similarity detection, auto-scheduling, smart notification (reminder H-3/H-1 deadline review).

**F. Reporting & E-Ticketing**
- Dashboard metrik (total paper, peserta, revenue).
- QR Code e-ticket (sekali pakai, scan check-in oleh panitia).
- Sertifikat elektronik otomatis pasca-acara.

## Non-Functional Requirements
- Desain: clean/modern, tema emerald/teal, light background, responsif (desktop & mobile).
- Keamanan: identitas double-blind tidak boleh bocor antar-role.
- Audit trail untuk perubahan data penting (harga, status bayar, keputusan review).
- Uptime tinggi saat periode kritis (pembukaan pendaftaran, deadline submission).

## Roadmap Implementasi (Ringkas)
1. **Foundation**: Docker setup, Laravel + SQLite, RBAC 4 role.
2. **Database Schema**: users, papers, paper_reviews, rooms, presentation_schedules, transactions, expenses, refunds, landing_contents.
3. **Backend Logic**: state machine paper, double-blind middleware, payment webhook, AI matching & scheduling engine.
4. **Frontend**: landing page CMS-driven, dashboard per role (Author/Reviewer/Participant/Admin) dengan Tailwind.
5. **Background Jobs**: reminder review (H-3/H-1), auto-expire pembayaran, generator PDF invoice & sertifikat.

## Pertanyaan Terbuka (Perlu Klarifikasi Klien)
- Payment gateway provider (Midtrans/Xendit/lainnya)?
- Ambang batas skor similarity/plagiarisme yang dianggap wajar?
- Kebutuhan multi-tenant di masa depan?
- Siapa yang menyediakan data awal expertise reviewer?

---
*Sumber: PRD_Quenza_Conference_System v1.0 (16 Agustus 2026) + roadmap implementasi fullstack.*