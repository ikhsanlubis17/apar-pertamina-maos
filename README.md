# Sistem Monitoring APAR (Alat Pemadam Api Ringan)

Sistem berbasis website untuk mendigitalisasi proses checklist pemeriksaan APAR (Alat Pemadam Api Ringan) yang menggantikan form manual tradisional.

## 🚀 Fitur Utama

### 📋 Manajemen APAR
- **Pendaftaran APAR**: Tambah, edit, dan hapus data APAR
- **Informasi Lengkap**: Nomor, lokasi, jenis, kapasitas, tanggal isi dan kadaluarsa
- **Status Monitoring**: Aktif, tidak aktif, kadaluarsa, pemeliharaan
- **Pencarian & Filter**: Cari APAR berdasarkan nomor atau lokasi

### 🔍 Sistem Inspeksi
- **Checklist Digital**: Pemeriksaan 7 item utama (selang, pin pengaman, isi tabung, handle, tekanan gas, corong bawah, kebersihan)
- **Status Item**: Baik (✔), Rusak (✘), Perlu Perbaikan (✘)
- **Tanda Tangan Digital**: Catatan digital petugas pemeriksa
- **Riwayat Inspeksi**: Histori lengkap pemeriksaan bulanan

### 📊 Dashboard & Laporan
- **Statistik Real-time**: Total APAR, aktif, kadaluarsa, akan kadaluarsa
- **Inspeksi Terbaru**: Daftar 5 inspeksi terakhir
- **Grafik Bulanan**: Visualisasi inspeksi per bulan
- **Notifikasi**: Peringatan APAR kadaluarsa dan perlu perhatian

## 🛠️ Teknologi

### Backend
- **Laravel 12** - PHP Framework
- **MySQL/PostgreSQL** - Database
- **Inertia.js** - Full-stack framework

### Frontend
- **React 19** - JavaScript Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Lucide React** - Icons

## 📦 Instalasi

### Prerequisites
- PHP 8.2+
- Node.js 18+
- Composer
- MySQL/PostgreSQL

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone <repository-url>
cd monitoring-apar
```

2. **Install Dependencies**
```bash
composer install
npm install
```

3. **Setup Environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database**
Edit file `.env` dan sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=monitoring_apar
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run Migrations & Seeders**
```bash
php artisan migrate
php artisan db:seed
```

6. **Build Assets**
```bash
npm run build
```

7. **Start Development Servers**
```bash
# Terminal 1 - Laravel Server
php artisan serve

# Terminal 2 - Vite Development Server
npm run dev
```

## 🗄️ Struktur Database

### Tabel `apars`
- `id` - Primary key
- `number` - Nomor APAR (unique)
- `location` - Lokasi APAR
- `type` - Jenis (powder, co2, foam, liquid)
- `capacity` - Kapasitas
- `fill_date` - Tanggal isi ulang
- `expiry_date` - Tanggal kadaluarsa
- `status` - Status (active, inactive, expired, maintenance)
- `notes` - Catatan tambahan

### Tabel `inspections`
- `id` - Primary key
- `apar_id` - Foreign key ke apars
- `inspector_id` - Foreign key ke users
- `inspection_date` - Tanggal pemeriksaan
- `digital_signature` - Tanda tangan digital
- `overall_status` - Status keseluruhan (good, needs_attention, critical)
- `notes` - Catatan pemeriksaan

### Tabel `inspection_items`
- `id` - Primary key
- `inspection_id` - Foreign key ke inspections
- `item_type` - Jenis item (hose, safety_pin, content, handle, pressure, funnel, cleanliness)
- `status` - Status item (good, damaged, needs_repair)
- `notes` - Catatan item

## 🎯 Penggunaan

### 1. Login & Dashboard
- Akses sistem dengan kredensial default:
  - Email: `admin@example.com`
  - Password: `password`
- Dashboard menampilkan statistik dan inspeksi terbaru

### 2. Manajemen APAR
- **Tambah APAR**: Klik "Tambah APAR" di dashboard
- **Lihat Daftar**: Menu "Kelola APAR" menampilkan semua APAR
- **Edit APAR**: Klik tombol edit pada daftar APAR
- **Detail APAR**: Klik tombol detail untuk melihat riwayat inspeksi

### 3. Inspeksi APAR
- **Inspeksi Baru**: Klik "Inspeksi Baru" atau dari detail APAR
- **Checklist**: Centang kondisi setiap item (✔/✘)
- **Simpan**: Sistem otomatis menentukan status keseluruhan
- **Riwayat**: Lihat semua inspeksi di menu "Riwayat Inspeksi"

### 4. Monitoring
- **Dashboard**: Pantau statistik real-time
- **Peringatan**: APAR kadaluarsa ditandai merah
- **Laporan**: Export data untuk analisis

## 🔧 Konfigurasi

### Customization
- **Jenis APAR**: Edit enum di migration `apars`
- **Item Inspeksi**: Modifikasi array `INSPECTION_ITEMS` di controller
- **Status**: Sesuaikan status di model dan controller

### Environment Variables
```env
APP_NAME="Sistem Monitoring APAR"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=monitoring_apar
DB_USERNAME=root
DB_PASSWORD=
```

## 📋 Checklist Item Inspeksi

Sistem mendukung 7 item pemeriksaan standar:

1. **Selang** - Kondisi selang APAR
2. **Pin Pengaman** - Keamanan pin pengaman
3. **Isi Tabung** - Kondisi isi tabung
4. **Handle** - Kondisi handle/gagang
5. **Tekanan Gas** - Tekanan gas dalam tabung
6. **Corong Bawah** - Kondisi corong bawah
7. **Kebersihan** - Kebersihan fisik APAR

## 🚨 Status & Peringatan

### Status APAR
- **Aktif** - APAR siap digunakan
- **Tidak Aktif** - APAR tidak digunakan
- **Kadaluarsa** - APAR melewati tanggal kadaluarsa
- **Pemeliharaan** - APAR sedang dalam pemeliharaan

### Status Inspeksi
- **Baik** - Semua item dalam kondisi baik
- **Perlu Perhatian** - Ada item yang perlu perbaikan
- **Kritis** - Ada item yang rusak

## 🔒 Keamanan

- **Authentication**: Laravel Breeze dengan email verification
- **Authorization**: Role-based access control
- **Validation**: Input validation di semua form
- **CSRF Protection**: Built-in Laravel CSRF protection
- **SQL Injection**: Eloquent ORM protection

## 📈 Monitoring & Maintenance

### Backup Database
```bash
php artisan backup:run
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Update Dependencies
```bash
composer update
npm update
```

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Untuk bantuan dan dukungan:
- Email: lubis163774@gmail.com
- Documentation: [Link ke dokumentasi]
- Issues: [GitHub Issues]

---

**Sistem Monitoring APAR** - Digitalisasi checklist pemeriksaan APAR untuk efisiensi dan dokumentasi yang lebih baik. 