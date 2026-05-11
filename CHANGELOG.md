# Sonara v11 — Cleanup & Lirik Halaman Terpisah

Release ini fokus bersih-bersih: hapus fitur yang gak kepake atau bikin ribet, fix
tombol-tombol yang mati, dan pisahkan lirik jadi halaman tersendiri supaya gak
tindih background full player.

## 🗑️ Dihapus

- **Canvas video** — fitur upload .mp4 per lagu. Capek nge-upload satu-satu dan
  storage HP cepat penuh. Default sekarang cuma Ken Burns cover (slow zoom-pan).
- **Equalizer 5-band** — efeknya subtle dan beberapa preset malah bikin audio
  jelek di speaker HP. Pakai aja audio asli MP3-nya.
- **Volume normalization** — peak detection async yang kadang lambat, efek
  marginal. Skip.
- **Mode Vinyl** — sisa-sisa v8 (state DB tetap untuk backward-compat).
- **Tombol Device** (pojok kiri bawah full player) — Sonara cuma main di HP
  sendiri, gak ada konsep Spotify Connect.
- **Tombol Share** (pojok kanan full player) — sesuai permintaan.
- **Tombol Download** di header album — semua lagu udah lokal, gak ada konsep
  download.

## ✨ Ditambah

### Lirik halaman terpisah penuh

Tap **LIRIK** di full player → halaman lirik baru muncul (slide-up, full-screen),
bukan overlay tindih background lagi.

- **Synced lyrics**: tetap auto-scroll dengan highlight + center baris aktif.
  Tap baris = jump ke timestamp itu.
- **Plain lyrics**: scroll biasa, font size lebih besar (text-lg, semibold).
- **Bottom mini-player**: seek bar + play/pause di bawah, jadi gak perlu close
  lirik buat kontrol musik.
- **Top bar**: cover kecil + judul + artis + tombol ⋯ (akses context menu lagu).
- Background: cover blur tipis + gradient hitam — tetap konsisten dengan vibe
  full player, tanpa interference.

### Tombol ⋯ di header album / artis / playlist

Sebelumnya cuma icon mati. Sekarang fungsional:

- **Album / Artis**: Putar semua, Acak semua, Tambah semua ke antrean,
  Tambah semua ke playlist.
- **Playlist**: di atas itu + Ganti cover playlist + Hapus playlist (dengan
  konfirmasi).

### Scroll position restore

Sebelumnya tiap kali masuk sub-view (album/artis/playlist) lalu kembali, scroll
loncat balik ke atas. Sekarang posisi scroll disimpan per-view dan di-restore
otomatis saat balik — gak perlu scroll ulang dari atas.

## 🐛 Fix

- Lirik tidak lagi tampak "tindih" canvas/cover karena sekarang full screen.
- Tombol-tombol di header album yang dulu dummy (download, more) sekarang
  berfungsi semua.

## 📦 Deploy

Upload 2 file: `index.html`, `sw.js`. Vercel redeploy, SW auto-update ke v16.

Test penting:
1. Buka full player → tap LIRIK → halaman lirik full slide-up dari bawah.
   Tombol kembali (Android) atau chevron-down menutup ke full player.
2. Buka album manapun → tap ⋯ di header → coba "Putar semua" / "Acak semua".
3. Scroll di Home, masuk ke album, kembali → scroll harusnya tetap di posisi
   yang sama, bukan balik ke atas.
4. Pengaturan → tidak ada lagi toggle Equalizer / Normalisasi volume / Mode
   Vinyl. Tinggal Crossfade, Gapless, Sleep fade-out, dan Cari lagu duplikat.
