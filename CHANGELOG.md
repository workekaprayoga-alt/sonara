# Sonara v8 — Audio quality + Polish

Versi ini fokus di **kualitas audio** dan **visual polish**. Termasuk patch lanjutan v7.1.

## ✨ Fitur baru

### 🎵 Crossfade antar lagu (2–12 detik)
Lagu yang lagi main fade-out smooth, sambil lagu berikutnya fade-in. Pakai **equal-power crossfade curve** (cos/sin) — bukan linear — supaya transisi terasa konstan tanpa "valley" volume di tengah. Setting di **Pengaturan → Crossfade antar lagu** (slider 0–12 detik, 0 = mati).

Implementasi pakai **dual audio element**: `audio` (main, EQ chain) + `audioB` (secondary). Saat crossfade window mulai (X detik sebelum lagu A habis), B mulai main dengan volume 0, kedua audio overlap, fade dalam X detik, lalu pindahkan stream B ke `audio` main untuk continue playback dengan EQ tetap aktif.

Crossfade auto-cancel kalau user skip manual atau buka full player.

### 🔗 Gapless playback
Toggle terpisah dari crossfade. Saat aktif (tanpa crossfade), lagu berikutnya start 0.5 detik lebih awal — hilangkan jeda alami di akhir track. Cocok untuk **album live, mix DJ, classical movement**.

### 🔊 Normalisasi volume
Toggle di Pengaturan. Saat aktif:
- Lagu yang belum pernah diputar: peak amplitude diukur otomatis di background (Web Audio decodeAudioData → sample peak), disimpan ke DB
- Setelah diukur: `audio.volume` di-adjust supaya peak mendekati 0.9 (target), clamp [0.5, 1.0]
- Lagu lama (yang sudah keras) di-cut sedikit, lagu pelan dibiarkan full

Hasilnya: ganti antar lagu nggak ada yang tiba-tiba kaget keras/pelan.

### 💿 Mode Vinyl
Toggle di Pengaturan. Saat aktif, di full player cover lagu jadi **piringan bulat** dengan **lubang tengah hitam** dan **berputar 360° per 14 detik** (kayak vinyl asli).

Animasi pakai CSS `animation-play-state` — saat audio pause, rotasi paused di posisi terakhir (gak reset ke 0). Saat resume, lanjut dari titik yang sama. Subscribe ke `state.isPlaying` tanpa full re-render supaya rotasi smooth.

### 😴 Sleep fade-out (30 detik terakhir)
Toggle di Pengaturan (default ON). Saat sleep timer aktif, di **30 detik terakhir** sebelum auto-pause, volume linear fade dari 1.0 → 0.05. Jangan kaget pas matiin musik buat tidur.

Volume auto-restore ke 1.0 saat timer dibatalkan atau setelah audio paused.

## 🎛 Pengaturan baru
Tombol **Pengaturan** (gear icon) di header **Koleksi** kanan atas. Berisi:

**Pemutaran**
- Slider Crossfade (0–12 detik)
- Toggle Gapless playback
- Toggle Normalisasi volume

**Tampilan**
- Toggle Mode Vinyl

**Pengatur Waktu Tidur**
- Toggle Fade-out saat akan tidur

Semua setting tersimpan di IndexedDB STORE_META, auto-load saat app start.

## 🐛 Patch v7.1 (re-applied di v8)
- `dbPut` return auto-generated key (untuk update session record)
- Periodic save tiap 10 detik (stats muncul cepat tanpa harus ganti lagu)
- Auto-refresh stats section saat history berubah (`onHistoryChanged` callback)
- Onboarding text di stats section lebih jelas

## 📊 Roadmap update

| Versi | Status | Target % Spotify-feel |
|-------|--------|----------------------|
| v6 | ✅ Done | ~75% |
| v7 | ✅ Done | ~82% |
| **v8** | ✅ **Done** | **~89%** |
| v9 | Next | ~95% (Tag editor, Backup, Drag-reorder) |
| v10 | Final | ~99% (Podcast, polish) |

## 🚀 Cara deploy
1. Upload `index.html` + `sw.js` ke GitHub (timpa yang lama)
2. Tunggu Vercel redeploy ~30 detik
3. Di HP: tutup Sonara → buka lagi → SW auto-update ke v13

## ✅ Test checklist

**Crossfade:**
- ✅ Set crossfade ke 5 detik di Pengaturan
- ✅ Putar lagu, biarkan main sampai akhir → 5 detik sebelum habis, lagu berikutnya mulai fade-in sambil yang ini fade-out

**Gapless:**
- ✅ Set crossfade ke 0, aktifkan Gapless → coba di album live, jeda antar track hampir hilang

**Normalisasi volume:**
- ✅ Aktifkan toggle → putar lagu yang biasanya keras dan yang pelan secara bergantian → seharusnya volume lebih konsisten (butuh 1 kali putar tiap lagu untuk kalibrasi)

**Mode Vinyl:**
- ✅ Aktifkan toggle → buka full player → cover berbentuk lingkaran berputar pelan
- ✅ Pause → rotasi berhenti di posisi terakhir → resume → lanjut dari sana

**Sleep fade-out:**
- ✅ Set sleep timer 1 menit → biarkan jalan → 30 detik terakhir volume turun perlahan

**Tombol kembali:**
- ✅ Buka Pengaturan → tekan tombol kembali Android → sheet tutup smooth (bukan keluar app)
