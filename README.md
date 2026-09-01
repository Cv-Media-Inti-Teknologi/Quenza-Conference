# Quenza Conference

Proyek ini dibangun menggunakan Laravel, Inertia.js, dan React.

## Panduan Instalasi (Installation Guide)

Jika Anda melakukan clone pada repository ini, ikuti langkah-langkah berikut untuk menjah aplikasi di komputer lokal Anda:


### 1. Instalasi Dependencies

Instal dependency untuk backend (PHP/Laravel) dan frontend (Node.js/React):

```bash
composer install
npm install
```

### 2. Pengaturan Environment (Konfigurasi)

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
# Pengguna Windows Command Prompt: copy .env.example .env```

Lalu generate application key:

```bash
php artisan key:generate
````

### 3. Konfigurasi Database

Buka file `.env` dan pastikan konfigurasi database sesuai dengan server lokal Anda (misalnya menggunakan MySQL/MariaDB atau SQLite):

```env
DB_CONNECTION=sqlite
# atau jika menggunakan mysql:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=quenza_conference
# DB_USERNAME=root
# DB_PASSWORD=
````

*(Catatan: Jika menggunakan SQLite, pastikan Anda membuat file kosong `database/database.sqlite` terlebih dahulu)*


### 4. Migrasi dan Seeding Database

Jalankan perintah ini untuk membuat tabel di database dan mengisi data awal (dummy/admin):

```bash
php artisan migrate --seed
``b

### 5. Menjalankan Development Server

Karena aplikasi ini menggunakan Laravel dan Vite, Anda harus menjalankan 2 terminal secara bersamaan:

**Terminal 1 (Frontend Vite):**
```bash
npm run dev
````

**Terminal 2 (Backend Laravel):**
```bash
php artisan serve
````

Aplikasi kini dapat diakses di browser melalui [http://localhost:8000](http://localhost:8000).