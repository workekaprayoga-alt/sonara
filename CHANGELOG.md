# Sonara v3 — Bug Fixes

Fokus rilis ini: stabilkan playback dan UI.

## Bug yang diperbaiki

### Bug 1: Musik mati saat tekan Home / minimize
**Penyebab:** Kombinasi — wake lock kurang kuat, MediaSession kurang lengkap, dan beberapa sinyal ke OS hilang saat Chrome dipindah ke background.

**Fix di kode:**
- MediaSession lengkap: handler `play`, `pause`, `prev`, `next`, `seek`, `stop`
- `playbackState` aktif disinkron ke OS — bantu Android/iOS mengenali audio aktif
- Position state dikirim 1x/detik — progress bar di lock screen akurat
- Wake lock di-acquire saat play, di-release saat pause
- Wake lock di-re-acquire otomatis saat tab balik visible
- Audio attribute `playsinline` + `webkit-playsinline` (penting di iOS)
- Tidak ada handler yang pause audio karena visibility change

**CATATAN PENTING:** Kalau setelah update musik MASIH mati saat Home/minimize, kemungkinan besar **battery optimization HP-mu yang bunuh Chrome**. Cara fix di sisi HP:

1. Settings HP → Apps → Chrome
2. Cari Battery / Battery usage
3. Set ke Unrestricted / Tidak dibatasi

HP merk tertentu butuh langkah ekstra:
- Xiaomi/MIUI: Settings → Apps → Manage apps → Chrome → Battery saver → No restrictions
- Oppo/Realme: Settings → Battery → App battery management → Chrome → Allow background activity ON
- Vivo: Settings → Battery → Background power consumption → Chrome → Allow
- Huawei: Settings → Apps → Chrome → Battery → Launch → Manage manually (ON semua)
- Samsung: Settings → Apps → Chrome → Battery → Unrestricted

PWA jalan di dalam Chrome, jadi setting yang dipakai adalah setting Chrome, bukan "Sonara" (Sonara nggak punya entry sendiri di Settings).

### Bug 2: Menu loncat-loncat saat buka full player
**Penyebab:** Tiap detik, audio `timeupdate` event memanggil `setState({ currentTime })` yang nge-trigger render full DOM rebuild. Saat user tap, element yang harusnya nerima tap udah keganti dengan element baru — tap "lewat" atau menu kelihatan loncat-loncat.

**Fix:**
- `currentTime` & `duration` dipisahkan dari state-yang-trigger-render
- Time updates pakai event-emitter terpisah
- Mini player progress bar update via DOM langsung, tidak re-render
- Full player progress + time labels update via DOM langsung
- Slider tidak "loncat balik" saat user pegang
- Debounce tap mini player 400ms → 500ms

Hasil: full player open sekali, tetap stabil, tap responsif.

## Update lain
- Service Worker `sonara-v4` (auto-fetch update baru)
- index.html network-first — kalau ada deploy baru, langsung dapet versi terbaru

## Cara update di HP setelah deploy
1. Update 5 file di GitHub (index.html, sw.js, manifest.json, 2 icon)
2. Tunggu Vercel re-deploy (~30 detik)
3. Di HP: buka Sonara dari home screen
4. Service worker baru otomatis install di background
5. Tutup Sonara, buka lagi → versi baru aktif

Kalau masih versi lama setelah dibuka ulang:
- Tekan lama icon Sonara di home screen → App info → Storage → Clear cache (JANGAN clear data — itu hapus lagu)
