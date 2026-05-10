# Sonara v7.1 — Patch tracking statistik

Fix kecil untuk v7: stats nggak muncul walaupun udah dengar berapa lagu.

## 🐛 Akar masalah

Di v7, session listening **cuma di-save ke history saat lagu ganti**. Jadi kalau user dengar 1-2 lagu yang panjang tanpa pernah ganti (atau yang kedua belum selesai), history-nya tetep kosong → stats tampil "Dengar lagu untuk mulai tracking...".

Plus, halaman Home cuma render sekali — kalau history baru ke-save sementara user lagi di Home, dia gak auto-refresh.

## ✅ Fix di v7.1

### 1. Periodic save tiap 10 detik
Setiap session yang udah dengar >= 5 detik, otomatis ke-save ke IndexedDB **tiap pertambahan 10 detik**, gak nunggu lagu ganti. Update pakai ID record yang sama (gak nge-spam history).

Hasilnya: dengar 1 lagu selama 15 detik aja, stats udah mulai jalan. Tap tab lain lalu balik Home, atau biarkan aja — auto-refresh sekarang jalan.

### 2. Auto-refresh stats section
Stats section sekarang subscribe ke history change. Setiap kali ada save baru (tiap 10 detik), Home page section stats refresh sendiri tanpa user perlu navigate ke tab lain dulu.

### 3. Onboarding text lebih akurat
Pesan sebelum ada data sekarang: *"Dengar lagu minimal 5 detik untuk mulai tracking. Statistik update otomatis tiap 10 detik tanpa harus ganti lagu."*

## 📁 File yang berubah

Cuma 3 file — gak perlu replace seluruh paket:

1. `index.html` — patch session tracking + auto-refresh
2. `sw.js` — bump cache ke `sonara-v12`
3. `CHANGELOG.md` — (file ini)

## Test setelah deploy

1. Tutup Sonara, buka lagi → SW update ke v12
2. Buka Home → masih "Dengar lagu minimal 5 detik..." (kalau pertama kali)
3. Putar lagu apa aja
4. **Diam aja di Home page** — stats akan muncul otomatis dalam 10-15 detik (gak perlu ganti tab)
5. Biarin lagu jalan terus → angka "Jam dengar" naik tiap 10 detik

Kalau masih gak muncul setelah 30 detik dengar, kemungkinan dbPut return tipe yang gak match — kasih kabar ke saya, saya cek log console.
