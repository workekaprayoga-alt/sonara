# Sonara v7 — Stats Dashboard ("Sonara Wrapped")

Versi ini fokus 100% di **tracking + analytics dengarmu** — fitur premium-style Spotify.

## ✨ Fitur baru

### 📊 Stats Dashboard di Home page
Section baru di paling atas Home: **kartu statistik penuh** dengan gradient ungu-pink-orange (vibes Spotify Wrapped).

### Filter periode
5 tab waktu, tap untuk switch:
- **Hari ini** — sejak jam 00:00 hari ini
- **7 Hari** — 7 hari ke belakang
- **30 Hari** — 30 hari ke belakang
- **Tahun** — 365 hari ke belakang
- **Semua** — sepanjang waktu

### 4 metric utama (grid 2×2)
- **⏱️ Jam dengar** — total durasi yang benar-benar didengar (bukan cuma play count)
- **🎵 Lagu unik** — berapa lagu berbeda yang didengar dalam periode
- **🔥 Streak** — berapa hari berturut-turut dengar musik (mundur dari hari ini)
- **▶️ Sesi** — total sesi dengar dalam periode

### Top Lagu
Top 5 lagu paling sering diputar di periode, dengan:
- Ranking (1, 2, 3 dapet warna emas/perak/perunggu)
- Cover art kecil
- Judul + artis
- Jumlah play count + total durasi yang didengar
- Tap = langsung putar

### Top Artis
Top 5 artis paling sering diputar di periode, dengan play count.

### 📈 Bar chart aktivitas harian
Visual bar chart 7 atau 30 hari terakhir — kelihatan langsung kapan kamu paling sering dengar musik. Bar warna hijau Sonara, tinggi proportional ke durasi.

### 💡 Wawasan (insights)
3 insight cards otomatis (muncul kalau ada cukup data):
- **🏆 Hari paling intens** — hari dengan jam dengar tertinggi (dengan tanggal lengkap)
- **🕐 Jam favorit dengar** — pukul berapa kamu paling sering dengar musik (pagi/siang/sore/malam)
- **📅 Hari paling musik** — hari apa dalam seminggu yang kamu paling sering dengar

## ⚙️ Tracking mechanism

Tiap kali lagu diputar:
1. **Session dimulai** saat audio play, tracked dengan timestamp + trackId
2. **Tiap 1 detik** durasi yang benar-benar didengar di-increment (cuma kalau audio playing, bukan paused atau buffering)
3. **Cap delta 2 detik** supaya HP sleep / wake / network lag tidak nge-fake jam dengar
4. **Saat lagu ganti / pause >10 detik / page closed**, session di-flush ke IndexedDB

Filter anti-spam: **session <5 detik nggak disimpan** (filter user skip cepet).

Data disimpan di IndexedDB store baru `history` dengan index `byTime` (untuk filter periode efisien) dan `byTrack` (untuk top tracks).

## 🔧 Update teknis

- DB version dinaikkan 2 → 3 (auto-migrate, gak ada data loss)
- Service Worker dinaikkan ke `sonara-v11`
- History cache 30 detik di-memory supaya dashboard render cepat
- Stats section render async (tidak blocking)

## Roadmap tersisa untuk 100% Spotify-feel

Sekarang Sonara udah di ~82%. Sisanya:
- **v8** (~89%): Crossfade, Gapless, Volume normalization, Vinyl mode
- **v9** (~95%): Tag editor, Backup/Restore, Drag-reorder, Bulk operations
- **v10** (~99%): Podcast support, Listening history detail, micro-interactions

## Cara update di HP

1. Update file di GitHub
2. Tunggu Vercel redeploy
3. Tutup Sonara, buka lagi → SW auto-update ke v11

Kalau masih versi lama: tekan lama icon → App info → Storage → Clear cache (jangan Clear data!).

## Test checklist

- ✅ Buka Home → stats section di paling atas
- ✅ Pertama kali (sebelum dengar apa-apa) → tampil pesan "Dengar lagu untuk mulai tracking..."
- ✅ Dengar 1 lagu >5 detik → balik Home → metric "Jam dengar" muncul angka
- ✅ Switch tab "Hari ini" / "7 Hari" / "30 Hari" → data filter sesuai
- ✅ Top Lagu menampilkan ranking + play count + durasi
- ✅ Bar chart muncul untuk periode 7/30 hari
- ✅ Insight cards muncul setelah ada data cukup
- ✅ Streak terhitung berdasarkan hari berturut-turut dengar musik

Selamat dengar lagi dan lihat statistikmu tumbuh! 🎵📊
