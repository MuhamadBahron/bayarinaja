# 🏷️ Bayarin Disini Aja

Aplikasi Web Pembayaran Tagihan Multi-Layanan & Pengisian Pulsa

## 📋 Deskripsi

Aplikasi ini adalah simulasi pembayaran tagihan rutin masyarakat Indonesia serta pengisian pulsa/paket data. Dibangun sepenuhnya di sisi klien (client-side) dengan Vanilla JavaScript, tanpa backend server nyata.

## ✨ Fitur

### 🔐 Autentikasi
- Halaman login dengan 3 akun demo
- Session management menggunakan LocalStorage

### 📊 Dashboard
- Ringkasan saldo simulasi
- Quick access ke 4 kategori layanan
- Promo banner
- Statistik: total transaksi, total pengeluaran, transaksi hari ini

### 📄 Bayar Tagihan
- 4 kategori: PLN, PDAM, Internet, Seminar
- Validasi nomor pelanggan
- Cek tagihan dengan loading state
- Detail tagihan lengkap
- 3 metode pembayaran: Virtual Account, QRIS (dengan countdown 5 menit), Teller/Kasir
- Proses pembayaran dengan loading state
- Bukti transaksi (struk) + print

### 🎓 SPP / Biaya Kuliah
- Input NIM dengan validasi
- Data dummy 3 mahasiswa dengan 6-8 cicilan
- Status Lunas/Belum Lunas
- Multi-select cicilan untuk dibayar
- Total otomatis terhitung

### 📱 Isi Pulsa & Paket Data
- 6 provider (Telkomsel, XL, Indosat, Tri, Smartfren, Axis)
- Validasi nomor HP
- Nominal pulsa: Rp10.000 - Rp200.000 + custom input
- Preview pembayaran
- 3 metode pembayaran

### 📜 Riwayat Transaksi
- Tabel histori lengkap
- Filter: Semua, Sukses, Pending
- Hapus semua riwayat

### 🎨 Fitur Pendukung
- Responsive design
- Toast notification
- Loading state
- Modal / Popup
- Print struk
- LocalStorage

## 🚀 Cara Menjalankan

1. Clone atau download repository ini
2. Buka folder `bayarin-app`
3. Jalankan `index.html` di browser (double click atau buka dengan Live Server)
4. Login dengan akun demo:
   - Email: `admin@bayarin.com`
   - Password: `password123`

Atau gunakan akun lain:
- `user@bayarin.com` / `user123`
- `demo@bayarin.com` / `demo123`

## 📁 Struktur File
