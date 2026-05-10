# Sonara v5 — Smooth UX + Lirik + Top Tracks + Smart Playlist + Smart Back Button

Fokus rilis ini: bikin transisi smooth di semua sheet, lirik otomatis, fitur "Putar lagi" + "Sering kamu putar", smart playlists otomatis, dan tombol kembali yang lebih pintar.

---

## Bug yang diperbaiki

### Bug: Sheet & full player tutup "loncat" / patah
**Penyebab:** Saat tombol close dipencet, `setState` langsung remove element dari DOM tanpa animasi keluar — sheet hilang seketika, kelihatan loncat.

**Fix:** Helper baru `closeSheetWithAnim()` yang:
1. Trigger animasi slide-down (sheet) + fade-out (backdrop)
2. Disable pointer events selama animasi (cegah double-tap)
3. Tunggu 240ms (animasi selesai)
4. Baru `setState` untuk remove dari DOM

Sekarang yang animated smooth saat close:
- ✅ Sheet **Antrean** (slide-down + backdrop fade)
- ✅ Sheet **Pengatur waktu tidur**
- ✅ **Menu konteks** lagu (tombol ⋯) — termasuk saat klik item di dalamnya, animasi keluar dulu baru aksi
- ✅ **Full player** (slide-down)
- ✅ Tombol **kembali Android** trigger animasi yang sama, bukan langsung hilang

---

### Bug: Tombol kembali matiin musik di tab utama
**Penyebab:** Saat di tab utama (Home/Cari/Koleksi), tekan tombol kembali = keluar app = Chrome bunuh proses Sonara = audio mati.

**Fix:** Smart navigation seperti Spotify/Instagram:
1. Lagi di **Cari** atau **Koleksi** → tap kembali → ke **Home** dulu (musik terus jalan)
2. Lagi di **Home** → tap kembali → toast peringatan
   - Kalau sedang play music: "💡 Tekan tombol Home supaya musik tetap jalan, atau tekan kembali sekali lagi untuk keluar"
   - Kalau tidak: "Tekan kembali sekali lagi untuk keluar"
3. Tap kembali kedua dalam 2 detik → baru benar-benar keluar app

Hasil: untuk navigasi dalam app, musik **tidak akan pernah** mati gara-gara tombol kembali. User harus dengan sengaja keluar app (double-tap) baru exit, dan ada warning sebelum musik mati.

---

## Fitur baru

### 🎵 Lirik sinkron + auto-fetch dari LRCLIB
- Auto-fetch lirik gratis dari LRCLIB.net (no API key, no signup)
- Format `.lrc` (synced) — lirik scroll otomatis ngikutin lagu
- Format `.txt` (plain) — lirik statik, scroll manual
- Toggle tampilan lirik di full player (klik area cover)
- Edit/hapus lirik manual lewat menu konteks lagu
- Lirik di-cache di IndexedDB — sekali fetch, selamanya offline

### 🔁 "Putar lagi" (Recently Played)
- Section pertama di Home (kalau ada riwayat dengar)
- 6 lagu terakhir yang diputar — grid 2 kolom kayak Spotify
- Tap → langsung play
- Auto-update setiap kali putar lagu baru
- Disimpan di IndexedDB (max 50 lagu terakhir)

### 🔥 "Sering kamu putar" (Top Tracks)
- Section kedua di Home (kalau ada >= 3 lagu yang pernah diputar)
- Sort by play count, top 10 lagu
- Top 3 dapat badge **#1**, **#2**, **#3** (warna hijau Spotify)
- Tampilkan jumlah putar (e.g., "12× • Sheila on 7")
- Horizontal scroll — kayak "Top Mix" Spotify

### 🤖 Smart Playlists otomatis
Section "Dibuat untukmu" di Home — auto-generated berdasar koleksi:
- **Lagu Disukai** — semua lagu yang di-heart (kalau >= 3)
- **Baru ditambahkan** — lagu yang ditambah dalam 30 hari terakhir
- **Discover Mix** — lagu yang belum pernah didengar (random 30, refresh tiap visit)
- **Favorit Mix** — lagu dengan playCount >= 5 (sorted)
- **Random Mix** — 50 lagu acak (kalau library >= 10)

Setiap smart playlist punya cover gradient unik (warna khas) + bisa di-shuffle dari sana.

---

## Update infrastruktur
- Service Worker dinaikkan ke `sonara-v5`
- Auto-track `playCount` dan `lastPlayedAt` setiap lagu
- Migration otomatis untuk track lama yang belum punya field ini
- Toast notification system (untuk feedback fetch lirik, peringatan back, dll.)

---

## Cara update di HP setelah deploy
1. Update 6 file di GitHub (index.html, sw.js, manifest.json, icon-192, icon-512, CHANGELOG.md)
2. Tunggu Vercel re-deploy (~30 detik)
3. Di HP: buka Sonara dari home screen
4. Service worker baru otomatis install di background
5. Tutup Sonara, buka lagi → versi baru aktif

Kalau masih versi lama setelah dibuka ulang:
- Tekan lama icon Sonara di home screen → App info → Storage → **Clear cache** (JANGAN clear data — itu hapus lagu)

---

## Test checklist setelah update
- ✅ Tap mini player → full player muncul smooth, tutup juga smooth (slide-down)
- ✅ Buka Antrean → tombol X di kanan atas, klik → sheet meluncur ke bawah pelan
- ✅ Buka Sleep Timer → tombol X muncul, sheet smooth out
- ✅ Tap tombol kembali Android di Cari/Koleksi → langsung ke Home, musik tetep jalan
- ✅ Tap tombol kembali Android di Home → toast muncul, musik tetep jalan
- ✅ Tap kembali kedua dalam 2 detik → keluar app
- ✅ Putar 5-6 lagu → "Putar lagi" muncul di Home
- ✅ Putar 1 lagu sampai habis → playCount naik → muncul di "Sering kamu putar"
- ✅ Klik tombol "Cari lirik" di full player → fetch dari LRCLIB → tampilkan lirik
