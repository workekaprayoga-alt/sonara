# Sonara v9 — Music Video Canvas + Lirik Fix

Versi ini ganti **Mode Vinyl → Canvas video / Ken Burns animasi**, plus fix bug lirik tembus vinyl, plus auto-import lirik dari MP3 yang udah punya lirik embedded.

## 🎬 Fitur baru: Canvas Video (Spotify-style)

Full player sekarang pakai sistem 2-layer background:

### 1. Default — Cover Animasi (Ken Burns)
Otomatis untuk **semua lagu**. Cover di-blur + zoom-pan pelan (28 detik per cycle), dengan layer kedua yang gerak arah berlawanan 32 detik. Plus color theme adaptif (gradient dari warna dominan cover).

Saat audio pause, animasi pause di posisi terakhir. Saat resume, lanjut dari titik yang sama.

Hasilnya: full player hidup tanpa user perlu upload apa-apa. Lebih dinamis dari blur statis sebelumnya.

### 2. Upgrade — Canvas Video (.mp4 / .webm)
Untuk lagu favorit, user bisa **upload video pendek looping** seperti Spotify Canvas:
- Tap ⋯ pada lagu → **"Upload Canvas video"**
- Pilih file .mp4 / .webm (max 25 MB, ideal: 5–15 detik, resolusi 480p–720p)
- Video disimpan permanen di IndexedDB
- Saat lagu diputar, video loop di background full player
- Audio tetap dari MP3 (video di-mute otomatis)
- Pause audio → pause video juga

Untuk hapus: ⋯ → **"Hapus Canvas video"**.

## 🐛 Bug fix penting

### Lirik tembus background (vinyl/canvas)
Sebelum: tap LIRIK → lirik nampak transparan di atas vinyl/cover → lirik gak keliatan jelas.

Sekarang: lyrics panel pakai **solid gradient background** (rgba(0,0,0,0.92) → 0.99). Lirik tampil di atas latar gelap tanpa distraksi dari video/animasi di belakang. Saat lirik ditutup, fade balik ke video/cover animasi smooth.

### Mode Vinyl dihapus
Sesuai pilihan: vinyl digantikan total dengan Canvas/Ken Burns. Setting "Mode Vinyl" di Pengaturan dihilangkan.

## 🎵 Auto-import lirik dari MP3

Parser ID3 sekarang baca **3 sumber lirik dari MP3**:

1. **USLT** (Unsynchronized Lyrics) — standar resmi ID3v2
2. **SYLT** (Synchronized Lyrics) — jarang tapi ada, auto-convert ke LRC equivalent
3. **TXXX** dengan description `lyrics-*` atau `LYRICS` — non-standar tapi banyak dipakai converter YT Music dan tool sejenis (contoh: MP3 Sal Priadi yang kamu test)

Bonus: kalau MP3 punya lirik embedded yang ternyata pakai format LRC (ada timestamp `[mm:ss]`), auto di-convert jadi synced lyrics yang highlight per baris.

Buffer parser juga diperbesar 256 KB → 1 MB supaya tag besar (lirik panjang + cover art 100+ KB) tetap ke-parse penuh.

**Prioritas lirik saat import:**
1. File sidecar .lrc atau .txt (paling akurat)
2. MP3 USLT
3. MP3 TXXX:lyrics-*
4. MP3 SYLT (synced)

## 📁 File yang berubah

3 file:
1. `index.html` — semua perubahan UI + parser
2. `sw.js` — bump cache `sonara-v14`
3. `CHANGELOG.md` — (file ini)

## 🚀 Deploy
1. Upload `index.html` + `sw.js` ke GitHub
2. Tunggu Vercel redeploy ~30 detik
3. Tutup app → buka lagi → SW update ke v14

## ✅ Test checklist

**Ken Burns (default):**
- ✅ Buka full player → cover blur perlahan zoom-pan (gak statis lagi)
- ✅ Pause audio → animasi berhenti, resume → lanjut dari posisi yang sama

**Canvas Video:**
- ✅ ⋯ pada lagu → klik **Upload Canvas video** → pilih .mp4 → toast "Canvas video tersimpan ✨"
- ✅ Buka full player → video loop di background
- ✅ Pause audio → video ikut pause
- ✅ ⋯ lagi → **Hapus Canvas video** → balik ke Ken Burns mode

**Lirik di atas Canvas:**
- ✅ Buka full player dengan canvas/cover → tap LIRIK → lirik muncul di latar gelap solid (gak tembus)
- ✅ Tap LIRIK lagi → fade balik ke video/cover

**Auto-import lirik (penting buat dicoba):**
- ✅ Import ulang MP3 Sal Priadi → lirik auto-muncul (gak perlu paste manual)
- ✅ Buka full player → tombol "LIRIK" muncul otomatis di top bar

## 📊 Roadmap

| Versi | Status | % Spotify-feel |
|-------|--------|----------------|
| v8 | ✅ Done | ~89% |
| v9 | ✅ Done | ~93% |
| v10 | Next | ~97% (Backup/Restore, Tag editor, Drag-reorder, Bulk ops) |
| v11 | Final | ~99% (Podcast, micro-interactions) |

## 💡 Tips Canvas video

Resolusi & ukuran ideal:
- **480p** (854×480) → ukuran 2–5 MB → loading cepat, kualitas cukup di HP
- **720p** (1280×720) → ukuran 5–15 MB → premium feel
- **Hindari 1080p** kecuali video sangat pendek (< 5 detik) → boros storage

Sumber Canvas video (legal):
- Record sendiri (10 detik dari video musik di YouTube lalu screen-record)
- Convert dari GIF favorit (banyak converter online: gif-to-mp4)
- Pinterest/IG Reels download
- Live wallpaper APK extractor

Saran format: **MP4 H.264** paling kompatibel di semua browser HP.
