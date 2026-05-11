# Sonara Changelog

## v13.2.1 — Fix Penyimpanan (Mei 2026)

### 🐛 Perbaikan

- **Ukuran file 0 KB untuk lagu lama** — Track yang di-import sebelum v13.2 belum punya field `fileSize`, jadi muncul "0 KB" di stats dan di "Lagu Paling Besar". Sekarang ada migrasi otomatis saat aplikasi dibuka: ukuran dibaca ulang dari blob audio yang sudah tersimpan di IndexedDB. Sekali buka aplikasi, semua data ukuran akan terisi.
- **Tombol kembali dari "Lagu Paling Besar"** — Sebelumnya menutup Lagu Paling Besar langsung jump ke Koleksi, melompati sheet Penyimpanan. Sekarang back button benar — Lagu Paling Besar → Penyimpanan → Koleksi.
- **Duplikat menu di sheet Penyimpanan** — Hapus shortcut "Cari Duplikat" dan "Cek Kesehatan" dari section Tindakan karena keduanya sudah ada di Pengaturan. Sekarang Tindakan hanya berisi "Lagu Paling Besar" (yang memang unik untuk sheet ini).

### Deploy

Upload **index.html** + **sw.js** → SW v21 auto-update. Saat aplikasi dibuka pertama kali setelah update, semua ukuran lagu akan otomatis di-backfill (proses cepat, langsung di background).

---

## v13.2 — Penyimpanan & Statistik (Mei 2026)

### 🆕 Penyimpanan & Statistik

- **Badge tap-able di Koleksi.** Di bawah judul "Koleksi Kamu" sekarang ada baris kecil `89 lagu · 245 MB ›`. Tap → buka sheet detail.
- **Sheet detail penyimpanan** (juga bisa diakses dari Pengaturan → Koleksi → "Penyimpanan & statistik"):
  - **Kuota perangkat** — total terpakai / total kuota yang dialokasikan browser. Progress bar warna: hijau (<70%), kuning (70–90%), merah (>90%).
  - **Estimasi sisa** — "Sisa ~3.2 GB (≈ 640 lagu lagi)" — dihitung dari rata-rata ukuran lagu di koleksimu.
  - **Penjelasan kuota** — collapsible "Bagaimana kuota dihitung?" — jelasin kalau Sonara nyimpan di storage browser, bukan galeri HP, dan kuota Android Chrome biasanya ~60% dari ruang kosong HP.
  - **Statistik koleksi** — total lagu, total ukuran file, total durasi (jam:menit), rata-rata per lagu.
  - **Detail breakdown** — lagu dengan cover, lagu dengan lirik, lirik tersinkron, lagu tanpa artis, breakdown format file (MP3, M4A, FLAC, dll).
  - **Tindakan cepat** — shortcut ke Lagu Paling Besar, Cari Duplikat, Cek Kesehatan.
- **Lagu Paling Besar (sorter)** — list semua lagu di-sort dari file terbesar duluan. Setiap baris ada ukuran + tombol hapus. Tap nama lagu → langsung play. Berguna untuk hapus file FLAC/WAV yang boros ruang.
- **Peringatan otomatis saat import.** Kalau total ukuran file yang mau di-import > 90% sisa kuota, tampil konfirmasi sebelum lanjut. Hindari import gagal di tengah jalan karena kehabisan ruang.

### Deploy

Upload **index.html** + **sw.js** → SW v20 auto-update.

---

## v13.1 — Fix daftar Artis terpotong (Mei 2026)

### 🐛 Bug fix utama

- **Daftar Artis & Album di tab Cari sebelumnya terpotong di 10 doang.** Akibatnya kalau punya 89 lagu dari 25 artis, cuma 10 yang keliatan, sisanya seperti "hilang". Sekarang **semua artis & album ditampilkan**, di-sort dari yang punya lagu terbanyak. Header juga nampakkan jumlah total ("25 artis", "18 album").

### 🆕 Editor info lagu

- **Edit info lagu** — item baru di context menu lagu (⋯). Bisa edit judul, artis, album, tahun rilis, komposer, penulis lirik. Berguna untuk file MP3 yang tag-nya tidak lengkap atau salah.
- Override disimpan di Sonara — file MP3 asli tidak diubah.
- Setelah simpan, scroll cache di-clear supaya daftar Artis/Album yang baru langsung kelihatan rapi.

### 💡 Tip baru di Koleksi

- Kalau ada ≥3 lagu dengan artist "Unknown Artist", muncul tip kuning yang jelasin: file MP3 ini tidak punya tag artis, makanya tidak muncul di daftar Artis. Arahan ke ⋯ → Edit info lagu untuk isi manual.

### Deploy

Upload **index.html** + **sw.js** → SW v19 auto-update.

---

## v13 — Polish Release (Mei 2026)

### 🐛 Bug fix

- **Scroll restore lebih reliable.** Sebelumnya beberapa view (Koleksi, Album, Artist) saat back-button keliatan reset ke atas. Sekarang pakai double-rAF + retry 5x kalau scrollHeight belum lengkap di frame pertama. Scroll juga cuma direstore saat view memang berganti (bukan tiap setState yang nggak ganti view).
- **Lagu baru langsung keliatan setelah import.** Setelah import berhasil, semua cached scroll position di-clear → view manapun yang dibuka selanjutnya (artist, album, koleksi) discroll dari atas, jadi lagu baru di posisi paling atas langsung kelihatan tanpa harus scroll up manual.

### 🔙 Back button HP integrasi penuh

- **Generic DOM dialog stack tracker.** Semua dialog ad-hoc (Tambah ke playlist, ⋯ menu album/playlist/artist, Cek kesehatan koleksi, Cari duplikat, Edit lirik, dll) sekarang register otomatis ke history stack. Tap back HP = tutup dialog teratas, bukan keluar app.
- **importDialog + songDetailsSheet** juga dimasukkan ke depth + popstate handler.

### 🎵 Pemutar utama (full player) — Spotify-style

Full player sekarang **scrollable**, bukan static fit-screen. Top bar tetap di tempat, sisanya scroll. Saat user scroll ke bawah dari kontrol pemutaran:

- **Pratinjau lirik** (card merah gradient ala Spotify). Untuk lagu dengan synced lyrics: highlight baris aktif yang lagi diputar + 4 baris berikutnya, refresh per detik. Untuk plain text: 5 baris pertama dengan baris pertama bold. Tombol "Tampilkan lirik" buka halaman lirik penuh.
- **Live lyrics overlay** di atas cover. Hanya muncul untuk lagu dengan synced lyrics — 1-2 baris aktif fade-in/out di bagian bawah cover dengan gradient dark, tetap readable. Tap cover = buka halaman lirik penuh.
- **Detail lagu row** — ringkasan teknis (durasi · tahun · ukuran), tap untuk buka modal detail lengkap.
- **Modal detail lagu** (Song Details Sheet):
  - Section "Detail": Judul, Artis, Album, Tahun rilis, Durasi, Komposer, Penulis lirik, status Lirik
  - Section "Info file": Nama file, Ukuran, Format, Bitrate (estimasi dari size/duration), Tanggal modify file
  - Section "Di koleksimu": Diimport, Total play count, Terakhir diputar, Disukai
  - Catatan transparansi: path absolute file tidak bisa diakses browser (sandbox).
- **Jelajahi [artis]** carousel — Lagu lain dari artis ini, Album lain dari artis ini, Tentang artis. Murni dari koleksi user, tanpa data eksternal.

### 📦 ID3 parser tambahan

Parser sekarang ekstrak frame baru:
- **TYER** (ID3v2.3) / **TDRC** (ID3v2.4) → tahun rilis (auto-extract 4-digit year)
- **TCOM** → composer
- **TEXT** → lyricist

Field `fileName`, `fileSize`, `fileType`, `fileLastModified`, `addedAt`, `playCount`, `lastPlayedAt` juga ditambah ke track object saat import dan dipakai di modal detail.

### Deploy

Upload **index.html** + **sw.js** ke GitHub → Vercel redeploy. SW otomatis update ke v18, halaman auto-reload saat user tidak lagi memutar musik.
