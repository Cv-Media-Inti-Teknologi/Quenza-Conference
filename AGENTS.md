# AGENTS.md — Aturan untuk Agen AI / Tools Otomatis

Base project **Quenza Conference System** (codename: *Oceri*).
Stack: **Slim Framework 4** + **SQLite** (PDO) + **Twig** + **Tailwind CSS via CDN**
(tanpa build step) + PHP >= 8.1.

Dokumen ini adalah sumber kebenaran bagi agen AI yang membantu mengembangkan
proyek ini. Ikuti aturan di bawah tanpa diminta ulang.

## ⚠️ Kebijakan Database: SQLite Selalu (Development & Production)

**SQLite adalah database final untuk development DAN production.**
Ini keputusan arsitektur proyek, bukan pilihan sementara atau placeholder.

- **Jangan pernah** menyarankan atau menambahkan MySQL, PostgreSQL, MariaDB,
  SQL Server, atau RDBMS lain — termasuk saat debugging performa.
- **Jangan pernah** menambahkan ORM atau lapisan abstraksi database
  (Doctrine, Eloquent, Propel, dll.) dengan alasan "biar gampang ganti
  database nanti". Ganti database tidak akan terjadi.
- Satu-satunya cara akses data: **PDO dengan driver `sqlite`**, melalui
  factory di `config/database.php`. Jangan membuat koneksi kedua.
- Tulis SQL yang kompatibel SQLite (`AUTOINCREMENT`, `datetime('now')`,
  `PRAGMA foreign_keys = ON`) — bukan dialek MySQL/Postgres.
- Skema dan query baru WAJIB diuji langsung terhadap `db/database.sqlite`.

## ⚠️ Kebijakan Templating: Twig + Tailwind via CDN

**Twig adalah satu-satunya template engine; Tailwind dipakai lewat CDN
tanpa build step.** Keduanya keputusan final proyek.

- **Jangan pernah** menambahkan engine lain (Blade, Smarty, Plates,
  raw PHP template) — halaman hanya dirender lewat `config/twig.php`.
- **Jangan pernah** menambahkan tooling frontend: npm/yarn/pnpm, Vite,
  Webpack, PostCSS, atau file CSS/JS build hasil kompilasi.
  Tag `<script src="https://cdn.tailwindcss.com"></script>` di
  `templates/base.html.twig` sudah cukup — jangan dihapus.
- Styling **hanya utility class Tailwind langsung di markup**
  (`class="mt-4 text-gray-600"`); dilarang menambah framework CSS lain.
- Hirarki template wajib: halaman publik extends `public.html.twig`,
  halaman admin extends `admin.html.twig`, keduanya extends
  `base.html.twig`. Jangan duplikat navbar/sidebar di file halaman.
- Nama file template selalu berakhiran `.html.twig`.

## Menjalankan Proyek

```bash
composer install                 # sekali, setelah clone
php -S localhost:8080 -t public  # server development
```

Cek kesehatan: buka `http://localhost:8080/health` — harus mengembalikan JSON `{"status":"ok"}`.
Halaman publik ada di `/`, area admin di `/admin`.

## Struktur Direktori

```
base_oceri/
├── public/index.php     # Front controller (satu-satunya entry point)
├── config/
│   ├── database.php     # Factory PDO SQLite
│   └── twig.php         # Factory Twig
├── src/
│   ├── Routes.php       # Definisi semua rute API + halaman
│   ├── Controllers/     # Kelas controller (logika request/response)
│   ├── Models/          # Kelas model (akses database via PDO)
│   └── Middleware/      # Middleware Slim (auth, CORS, dll.)
├── templates/
│   ├── base.html.twig   # Root master: kerangka HTML + Tailwind CDN
│   ├── public.html.twig # Master halaman PUBLIK (navbar + footer)
│   ├── admin.html.twig  # Master area ADMIN (sidebar + topbar)
│   └── pages/           # Halaman konkret, extends salah satu master
└── db/database.sqlite   # File database SQLite
```

## Aturan Wajib

1. **Coding standard: PSR-12.** Gunakan `declare(strict_types=1);` di setiap
   file PHP baru. Autoloading PSR-4: namespace `App\` → direktori `src/`
   (contoh: `App\Controllers\UserController` → `src/Controllers/UserController.php`).
2. **Pola arsitektur MVC-ish:**
   - `Routes.php` hanya mendaftarkan rute dan memanggil Controller.
   - Controller menerima `Request`/`Response` PSR-7, memvalidasi input,
     memanggil Model, lalu mengembalikan response (JSON untuk API,
     Twig render untuk halaman HTML).
   - Model berisi query SQL via **prepared statements** (selalu, tanpa
     kecuali — jangan pernah menggabungkan input user ke string SQL).
3. **Response API selalu JSON** dengan header `Content-Type: application/json`.
   Format konsisten: sukses → data langsung atau `{"data": ...}`;
   error → `{"error": "pesan singkat"}` dengan status code HTTP yang tepat.
   Halaman HTML dirender via Twig, bukan JSON.
4. **Jangan edit** `vendor/`, `public/index.php` (kecuali bootstrap baru),
   atau `config/database.php` tanpa alasan kuat.
5. **Migrasi skema:** belum ada tool migrasi; buat tabel via SQL langsung di
   `db/database.sqlite` dan catat skrip `.sql`-nya di `db/migrations/*.sql`
   agar peserta magang lain bisa menjalankan ulang.

## Konvensi Slim 4

- Routing: `$app->get('/path', [UserController::class, 'index']);`
- Dependency sederhana lewat closure/factory; butuh DI container penuh baru
  pertimbangkan `php-di/php-di`.
- Middleware global didaftarkan di `index.php`; middleware rute di
  `Routes.php` (`->add(new AuthMiddleware())`).

## Konvensi SQLite

- Satu file DB: `db/database.sqlite`. Jangan membuat file DB lain.
- Aktifkan `PRAGMA foreign_keys = ON` di setiap koneksi (sudah ada di
  factory — jangan dilepas).
- Tabel pakai nama jamak snake_case (`users`, `conference_rooms`),
  primary key `id INTEGER PRIMARY KEY AUTOINCREMENT`,
  kolom timestamp `created_at TEXT DEFAULT (datetime('now'))`.

## Yang Tidak Boleh Dilakukan Agen

- **Mengusulkan atau memigrasi ke database selain SQLite** (lihat kebijakan
  di atas — berlaku untuk production juga).
- **Menambah template engine lain atau tooling frontend/build** (npm, Vite,
  Webpack, PostCSS) atau menghapus Tailwind CDN — lihat kebijakan templating.
- Menambah dependency composer baru tanpa diminta.
- Meng-commit `vendor/` atau file journal/WAL SQLite.
- Menulis logika bisnis di dalam closure rute jika sudah > ~15 baris;
  pindahkan ke Controller.
