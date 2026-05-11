# Sonara Changelog

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
