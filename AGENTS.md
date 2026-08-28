# AGENTS.md — Aturan untuk Agen AI / Tools Otomatis

Base project **Quenza Conference System** (codename: *Oceri*).
Stack: **Laravel 12** + **Inertia.js** + **React 19** + **Vite 8** +
**Tailwind CSS 4** (build step via `@tailwindcss/vite`) + **SQLite** + PHP >= 8.2.

Dokumen ini adalah sumber kebenaran bagi agen AI yang membantu mengembangkan
proyek ini. Ikuti aturan di bawah tanpa diminta ulang.

## ⚠️ Kebijakan Database: SQLite Selalu (Development & Production)

**SQLite adalah database final untuk development DAN production.**
Ini keputusan arsitektur proyek, bukan pilihan sementara atau placeholder.

- **Jangan pernah** menyarankan atau menambahkan MySQL, PostgreSQL, MariaDB,
  SQL Server, atau RDBMS lain — termasuk saat debugging performa.
- **Jangan pernah** menambahkan ORM pihak ketiga (Doctrine, Propel, dll.).
  Gunakan **Eloquent** bawaan Laravel dengan driver `sqlite`.
- Konfigurasi koneksi ada di `.env` (`DB_CONNECTION=sqlite`) dan
  `config/database.php`. Jangan membuat koneksi kedua.
- Tulis migrasi yang kompatibel SQLite — hindari fitur khusus
  MySQL/Postgres (misalnya `ENUM`, `JSON` column type di migration).
- Migrasi dikelola via `php artisan migrate`. File migrasi ada di
  `database/migrations/`.

## ⚠️ Kebijakan Frontend: Inertia.js + React + Vite + Tailwind CSS

**Inertia.js dengan React adalah satu-satunya cara merender halaman;
Tailwind CSS dikompilasi via Vite dengan `@tailwindcss/vite`.**
Keduanya keputusan final proyek.

- **Jangan pernah** menambahkan engine template lain (Blade views untuk
  halaman, Livewire, Vue, Svelte) — halaman dirender via Inertia + React.
  Satu-satunya file Blade yang boleh ada: `resources/views/app.blade.php`
  (root template Inertia).
- **Jangan pernah** menghapus atau mengganti Vite, `@tailwindcss/vite`,
  atau `laravel-vite-plugin`. Jangan menambahkan Webpack, Mix, atau
  bundler lain.
- Styling menggunakan **Tailwind CSS utility classes** dan **custom Quenza
  design tokens** yang didefinisikan di `tailwind.config.js`.
- Komponen CSS reusable (`.quenza-card`, `.quenza-btn-*`, `.quenza-input`,
  `.quenza-badge-*`, dll.) didefinisikan di `resources/css/app.css`.
  Gunakan class-class ini — jangan duplikasi styling inline.
- Hirarki layout: halaman admin menggunakan `AdminLayout.jsx`
  (Sidebar + Topbar). Jangan duplikat sidebar/topbar di file halaman.
- Nama file komponen React: **PascalCase** berakhiran `.jsx`.

## Menjalankan Proyek

```bash
composer install                 # install PHP dependencies
npm install                      # install JS dependencies
php artisan migrate              # jalankan migrasi database
php artisan serve                # server Laravel (port 8000)
npm run dev                      # Vite dev server (HMR)
```

Atau jalankan semuanya sekaligus:
```bash
composer dev                     # concurrently: serve + queue + pail + vite
```

Halaman publik ada di `/`, area admin di `/admin`, login di `/login`.

## Struktur Direktori

```
Quenza-Conference/
├── app/
│   ├── Http/
│   │   ├── Controllers/     # Controller Laravel (return Inertia::render)
│   │   └── Middleware/       # Middleware (auth, dll.)
│   ├── Models/               # Eloquent models
│   └── Providers/            # Service providers
├── bootstrap/                # Laravel bootstrap
├── config/                   # Laravel config (database.php, app.php, dll.)
├── database/
│   ├── migrations/           # File migrasi skema
│   ├── seeders/              # Database seeders
│   └── database.sqlite       # File database SQLite
├── public/
│   ├── index.php             # Front controller
│   └── build/                # Output Vite build (auto-generated)
├── resources/
│   ├── css/app.css           # Global CSS + Quenza utility classes
│   ├── js/
│   │   ├── app.jsx           # Entry point React + Inertia
│   │   ├── Components/       # Komponen React reusable
│   │   ├── Layouts/          # Layout wrappers (AdminLayout, dll.)
│   │   └── Pages/            # Halaman Inertia (Dashboard, Schedule, dll.)
│   └── views/
│       └── app.blade.php     # Root Blade template untuk Inertia
├── routes/
│   └── web.php               # Definisi semua rute web
├── tailwind.config.js         # Konfigurasi Tailwind + Quenza design tokens
├── vite.config.js             # Konfigurasi Vite
└── storage/                   # Cache, logs, sessions
```

## Aturan Wajib

1. **Coding standard: PSR-12.** Gunakan `declare(strict_types=1);` di setiap
   file PHP baru. Autoloading PSR-4: namespace `App\` → direktori `app/`.
2. **Pola arsitektur Laravel + Inertia:**
   - `routes/web.php` mendaftarkan rute dan memanggil Controller.
   - Controller menerima `Request`, memvalidasi input, memanggil Model,
     lalu mengembalikan `Inertia::render('PageName', $props)` untuk halaman
     atau response JSON untuk API endpoint.
   - Model (Eloquent) menangani query database. Gunakan **query builder
     atau Eloquent** — jangan raw query kecuali benar-benar diperlukan.
   - Selalu gunakan mass assignment protection (`$fillable` / `$guarded`).
3. **Response API** menggunakan `response()->json(...)` dengan status code
   HTTP yang tepat. Halaman HTML dirender via Inertia, bukan JSON.
4. **Jangan edit** `vendor/`, `node_modules/`, `public/build/`,
   `bootstrap/`, atau file auto-generated lainnya.
5. **Migrasi skema** via `php artisan make:migration`. Jangan edit file
   migrasi yang sudah dijalankan — buat migrasi baru.

## Konvensi Laravel

- Routing: `Route::get('/path', [Controller::class, 'method']);`
- Controller: `return Inertia::render('Dashboard', ['data' => $data]);`
- Middleware didaftarkan di `bootstrap/app.php` atau langsung di route
  (`->middleware('auth')`).
- Gunakan `php artisan make:*` untuk generate boilerplate
  (controller, model, migration, dll.).

## Konvensi SQLite

- Satu file DB: `database/database.sqlite`. Jangan membuat file DB lain.
- Tabel pakai nama jamak snake_case (`users`, `conference_rooms`),
  primary key `id` (auto-increment via Laravel migration default).
- Timestamp kolom: `$table->timestamps()` (created_at, updated_at).

## Konvensi Frontend (React + Tailwind)

- Komponen di `resources/js/Components/` — reusable, PascalCase.
- Halaman di `resources/js/Pages/` — sesuai nama Inertia route.
- Layout di `resources/js/Layouts/` — wrapper layout (AdminLayout, dll.).
- **Gunakan Quenza design tokens** dari `tailwind.config.js`:
  - Warna: `bg-quenza-sidebar`, `text-quenza-text-primary`,
    `bg-quenza-secondary`, `text-quenza-ai`, dll.
  - Font size: `text-quenza-small`, `text-quenza-medium`,
    `text-quenza-large`, `text-quenza-xlarge`, dll.
  - Font weight: `font-quenza-regular`, `font-quenza-semibold`,
    `font-quenza-bold`, dll.
  - Border radius: `rounded-quenza-md`, `rounded-quenza-lg`,
    `rounded-quenza-xl`, dll.
- **Gunakan CSS utility classes** dari `resources/css/app.css`:
  `.quenza-card`, `.quenza-btn-primary`, `.quenza-btn-secondary`,
  `.quenza-input`, `.quenza-badge-success`, dll.
- Import hook Inertia: `import { useForm, usePage } from '@inertiajs/react';`

## Yang Tidak Boleh Dilakukan Agen

- **Mengusulkan atau memigrasi ke database selain SQLite** (lihat kebijakan
  di atas — berlaku untuk production juga).
- **Menambah framework frontend lain** (Vue, Svelte, Livewire) atau
  mengganti React/Inertia.
- **Menghapus atau mengganti Vite/Tailwind build pipeline** — jangan
  menambahkan Webpack, Laravel Mix, atau CDN Tailwind.
- Menambah dependency composer/npm baru tanpa diminta.
- Meng-commit `vendor/`, `node_modules/`, atau `public/build/`.
- Menulis logika bisnis di dalam closure rute jika sudah > ~15 baris;
  pindahkan ke Controller.
