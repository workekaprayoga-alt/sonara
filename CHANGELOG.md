# Sonara v12 — Spotify-style Full Player + Bug Fix

Dua hal utama: fix lagu yang gak bisa diputar (durasi 0), dan rombak full player
jadi scrollable dengan section "Jelajahi artis" + "Tentang artis" persis kayak
Spotify.

## 🐛 Bug fix utama: lagu gak bisa diputar / durasi 0

Penyebab di v10/v11:
- `extractMetadata` cuma kasih 3 detik untuk baca durasi → di HP slow atau MP3
  besar, durasi sering masih 0 saat timeout
- MP3 VBR (Variable Bit Rate) sering report `Infinity` atau `NaN` untuk
  `audio.duration` → disimpan sebagai 0 di DB
- `loadAndPlay` gak validasi blob — kalau blob hilang/corrupt (storage
  IndexedDB di-evict browser, quota habis), `URL.createObjectURL(null)` throw
  silent, lagu gak jalan tanpa pesan

Fix di v12:
- **Timeout durasi 3s → 5s**, plus handle `Infinity`/`NaN` properly
- **Auto-fix durasi saat play**: lagu dengan durasi 0 akan diukur ulang saat
  pertama diputar, lalu disimpan permanen ke DB
- **Validasi blob** di `loadAndPlay`: kalau hilang/rusak, kasih toast jelas
  "File audio hilang, import ulang lagu ini" — bukan diam-diam mati

## 🩺 Cek Kesehatan Koleksi (tools baru)

Pengaturan → Koleksi → **Cek kesehatan koleksi**

Scan semua lagu di koleksi, identifikasi yang bermasalah:
- **File hilang** — blob audio gak ada di IndexedDB (paling kritis, gak bisa
  diputar). Bisa hapus satu-satu atau bulk "Hapus semua".
- **Durasi belum ke-ukur** — masih bisa diputar, durasi akan auto-fix saat
  pertama play. Info aja, gak perlu action.

Yang kemungkinan terjadi di kasusmu:
- Kalau 60 lagu hilang blob-nya → browser evict IndexedDB (storage HP penuh)
- Kalau cuma durasi 0 tapi bisa diputar → metadata bug yang sekarang udah
  di-fix; tinggal play satu kali, durasi otomatis terisi

## 🎬 Full Player baru — scrollable, Spotify-style

Sebelumnya full player static — kontrol di tengah, sisanya kosong. Sekarang
scrollable dengan section di bawah kontrol:

### Cover besar + info + kontrol (zone atas, seperti biasa)
Cover sekarang square ~85vw besar, lebih dominan, mirip Spotify modern.

### "Jelajahi [artis]" — section baru
Carousel horizontal di card abu-abu:
- **Card "Lagu oleh [artis]"** — tap = buka artist view
- **Card per album lain dari artis ini** — tap = buka album view
- Diambil murni dari koleksimu sendiri, tidak ada data eksternal

### "Tentang artis" — section baru
Card abu-abu dengan:
- **Foto artis besar** (4:3 ratio) — auto-fetch dari MusicBrainz, fallback ke
  cover album kalau gak ada
- **Nama artis** + stats dari koleksimu: "N lagu di koleksimu • M× diputar"
- **Tombol "Lihat artis"** — buka artist view

### Kenapa tidak ada "Pratinjau lirik"?
Sesuai pilihanmu — lirik udah cukup di halaman terpisah (v11). Tombol LIRIK di
top bar tetap ada untuk buka halaman lirik full.

### Kenapa tidak ada "Kredit"?
99% MP3 cuma punya tag artist + album, tidak ada composer/lyricist. Kalau
ditambah, mayoritas lagu kreditnya kosong → bikin section ini useless.
Skip dulu, bisa ditambah nanti kalau mayoritas MP3-mu punya tag TCOM/TEXT.

### Kenapa tidak ada "Pendengar bulanan" / "Serupa dengan"?
Itu data Spotify dari jutaan user. Sonara murni lokal, gak punya akses ke data
recommendation engine. Kita pakai data yang kita punya: koleksi user sendiri.

## 📦 Deploy

Upload 2 file: `index.html`, `sw.js`. SW auto-update ke v17.

Test penting:
1. **Cek kesehatan koleksi** dulu — Pengaturan → "Cek kesehatan koleksi".
   Kalau ada "File hilang", itu yang bikin 60 lagu gak bisa diputar.
2. Buka full player → scroll ke bawah → harusnya muncul "Jelajahi [artis]"
   carousel + "Tentang artis" dengan foto + stats.
3. Lagu yang durasinya 0 → play satu kali → durasi harusnya muncul. Restart
   app, lagu tersebut harusnya nampak durasi yang benar.
