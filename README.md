# OtoPartID

Katalog dan pembanding harga sparepart kendaraan (motor dan mobil). Pengguna dapat melihat daftar komponen, membandingkan harga di beberapa marketplace, dan menambahkan data sparepart baru.

Stack saat ini: HTML, **Tailwind CSS** (CDN), **JavaScript**, **jQuery**. Data masih dummy (belum terhubung backend/database).

## Struktur
| File | Isi |
|---|---|
| `index.html` | Dashboard: kartu statistik, sparepart terbaru, jumlah per kategori |
| `daftar.html` | Tabel sparepart: cari, filter kategori, urutkan, hapus, tambah cepat |
| `form.html` | Form tambah sparepart dengan validasi |
| `detail.html` | Detail produk dan perbandingan harga marketplace |
| `script.js` | Seluruh logika JavaScript dan jQuery |

## Alasan memilih Tailwind
Tampilan OtoPartID (kartu statistik, badge "Termurah", tabel perbandingan marketplace) cukup spesifik. Utility class Tailwind memberi kendali penuh tanpa menimpa gaya bawaan, dan prefix responsif (`md:`, `lg:`) memudahkan layout dashboard menyesuaikan layar mobile dan desktop.

## Tugas 5: JavaScript dan jQuery

### JavaScript murni
- **Data dummy**: array of object `DATA_AWAL` (kode, nama, kategori, deskripsi, harga per marketplace). Data tambahan disimpan di `localStorage` agar terbawa antar halaman.
- **Function pemroses data**: `hitungStatistik()` (jumlah data, per kategori, marketplace, harga termurah), `filterData()`, `urutkanData()`, `hargaTermurah()`, `formatRupiah()`.
- **Struktur kendali**: perulangan `for` untuk render tabel, daftar kategori, dan baris harga marketplace; percabangan `if/else` untuk kondisi data kosong, sparepart tidak ditemukan, penentuan status "Termurah", dan mode urutan.
- Semua tabel dirender dari array lewat JavaScript, tidak ditulis manual di HTML.

### jQuery
| Efek / event | Lokasi | Fungsi |
|---|---|---|
| `slideToggle()` | `daftar.html` | Tampilkan/sembunyikan form tambah cepat |
| `slideToggle()` | `detail.html` | Tampilkan/sembunyikan deskripsi produk |
| `fadeOut()` | `daftar.html` | Efek saat baris sparepart dihapus |
| `fadeIn()` / `fadeOut()` | semua halaman | Notifikasi (toast) setelah tambah/hapus/reset |
| `on("input")`, `on("change")` | `daftar.html` | Pencarian, filter, dan pengurutan langsung |
| `on("click")` | `daftar.html`, `index.html` | Hapus data (dengan konfirmasi), reset data contoh |
| `on("submit")` | `form.html`, `daftar.html` | Validasi: field kosong, harga harus > 0, kode OEM tidak boleh ganda |

### Cara menjalankan
Buka `index.html` di browser (butuh internet untuk CDN Tailwind dan jQuery).

### Demo dan screenshot
Simpan di `docs/screenshots/`.

| Interaksi | Sebelum | Sesudah |
|---|---|---|
| Tampilkan form tambah cepat | ![](docs/screenshots/form-cepat-sebelum.png) | ![](docs/screenshots/form-cepat-sesudah.png) |
| Validasi form kosong | ![](docs/screenshots/validasi-sebelum.png) | ![](docs/screenshots/validasi-sesudah.png) |
| Hapus sparepart | ![](docs/screenshots/hapus-sebelum.png) | ![](docs/screenshots/hapus-sesudah.png) |
| Cari / filter | ![](docs/screenshots/filter-sebelum.png) | ![](docs/screenshots/filter-sesudah.png) |
| Tampilkan deskripsi (detail) | ![](docs/screenshots/deskripsi-sebelum.png) | ![](docs/screenshots/deskripsi-sesudah.png) |



## Identitas
Muhammad Fauzan Bahri - Tugas Pemrograman Web
