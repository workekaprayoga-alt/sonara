# Sonara v6 — Color, Sound, Cover

Rilis besar: 1 fix penting + 3 fitur baru yang impactful.

## 🐛 Bug fix

### Lirik super-smooth (akhirnya!)
Feedback: "liriknya masih kurang smooth"

**Penyebab kenapa v5.1 belum cukup halus:** `scrollIntoView({ behavior: 'smooth' })` punya overshoot/bouncing kecil yang ngerusak feel halus, plus pas di-trigger berulang kali dia interrupt scroll yang lagi jalan.

**Fix:** Total redesign auto-scroll lirik:
- Container scroll diganti pakai **transform translateY** (bukan scrollIntoView)
- Inner container di-`position: absolute` dengan `top: 50%`, dan kita translateY negatif sesuai offset baris aktif → baris aktif selalu tepat di tengah
- Transisi 800ms `cubic-bezier(0.22, 1, 0.36, 1)` — kurva yang sangat halus, ngeluncur tanpa overshoot
- Baris animasi diperpanjang 600ms → **900ms** dengan curve yang sama supaya synced dengan scroll
- Plus efek blur subtle (0.4px–0.8px) untuk baris yang jauh dari aktif — kerasa "depth of field"

Hasilnya: lirik benar-benar mengalir, kayak Apple Music / Musixmatch terbaik.

## ✨ Fitur baru

### 1. Color Theme Adaptif 🎨
Background full player sekarang **berubah warna sesuai cover art lagu**:
- Extract 2 warna dominan dari cover art (algoritma color quantization dengan saturation weighting — skip warna grayscale dan ekstrem)
- Apply sebagai gradient: warna primer di atas → sekunder di tengah → hitam di bawah
- Fade-in halus 700ms saat warna selesai di-extract (cache per track ID jadi cepat di kemudian hari)
- Lagu pop warna terang → background terang; lagu metal warna gelap → background gelap; lagu pink → background pink. Persis kayak Spotify Now Playing.

### 2. Equalizer 5-Band 🎚️
Akses dari **menu konteks lagu (⋯) → Equalizer**.

5 band frekuensi: **60Hz** (bass), **250Hz** (low-mid), **1kHz** (mid), **4kHz** (high-mid), **12kHz** (treble). Range ±12 dB per band.

**9 preset siap pakai:**
- Normal
- Bass Booster
- Treble Boost
- Vocal Boost
- Pop, Rock, Jazz, Classical, Electronic

Atau geser slider manual → otomatis jadi "Custom". Settings tersimpan di IndexedDB, ke-load saat app start. Smooth ramp 100ms saat ganti gain (tidak ada "klik" / pop noise).

Implementasi: Web Audio API + BiquadFilter chain (gratis, no library).

### 3. Auto-fetch Cover Art 🖼️
Sumber: **MusicBrainz + Cover Art Archive** (gratis, no API key, legal).

**Single track:** ⋯ di lagu → "Cari cover otomatis" — hanya muncul kalau lagu belum punya cover.

**Bulk:** Di Koleksi, kalau ada lagu tanpa cover, muncul banner "X lagu belum punya cover art" + tombol **"Cari semua"**. Auto rate-limit 1.1 detik per lagu (sesuai aturan MusicBrainz). Konfirmasi dulu sebelum mulai supaya nggak ke-trigger nggak sengaja.

Setelah cover di-fetch:
- Disimpan permanen di IndexedDB (sama treatment seperti cover yang di-embed di MP3)
- Color theme adaptif langsung jalan untuk lagu tersebut
- Mini player, full player, home, library — semua ikut update

## ⚙️ Update teknis

- Service Worker dinaikkan ke **`sonara-v10`**
- Audio chain: `audio element → MediaElementSource → 5 BiquadFilter → AudioContext.destination` (cuma di-init kalau EQ pernah dipakai, lazy)
- Color extraction pakai canvas 50×50 down-sample + bucket 5-bit per channel + saturation weighting
- Cache dominant colors per track ID supaya buka lagu yang sama nggak compute ulang

## Cara update di HP
1. Update 6 file di GitHub (index.html, sw.js, manifest.json, 2 icon, CHANGELOG.md)
2. Tunggu Vercel re-deploy ~30 detik
3. Di HP: tutup Sonara, buka lagi → SW auto-update ke v10

Kalau masih versi lama: tekan lama icon Sonara → App info → Storage → **Clear cache** (jangan Clear data!).

## Test checklist
- ✅ Lirik sinkron pergantian baris benar-benar mengalir (tidak lagi ada jitter atau loncatan)
- ✅ Buka lagu dengan cover berwarna terang → background full player ngikutin warnanya
- ✅ Ganti lagu → background fade transisi ke warna baru
- ✅ ⋯ di lagu → ada item "Equalizer" → buka sheet 5 slider + preset
- ✅ Pilih preset "Bass Booster" → bass kerasa lebih kenceng (test pakai headphone)
- ✅ Slider manual → label preset jadi "Custom"
- ✅ Restart app → preset terakhir tersimpan
- ✅ Koleksi → banner "X lagu belum punya cover" → "Cari semua" → progress per lagu
- ✅ ⋯ pada lagu tanpa cover → ada "Cari cover otomatis"

## Belum di v6 (untuk v7)
- Vinyl mode (cover berputar)
- Crossfade & gapless playback
- Stats dashboard ("Wrapped" vibes)
- Tag editor (edit metadata di app)
- Backup/restore koleksi
- Drag-reorder antrean
