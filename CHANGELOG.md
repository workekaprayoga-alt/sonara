# Sonara v4 — Bug Fixes (lanjutan)

Fokus rilis ini: tombol kembali, navigasi sheet, dan keyboard pencarian.

## Bug yang diperbaiki di v4

### Bug 3: Tombol Kembali Android matiin musik
**Penyebab:** Sonara dianggap browser sebagai "halaman tunggal". Tekan tombol kembali = keluar app = Chrome bunuh prosesnya = audio mati.

**Fix:** History API integration.
- Tiap kali ada overlay terbuka (full player, antrean, sleep timer, context menu, atau sub-view album/artis/playlist), Sonara push 1 entry ke browser history.
- Tekan tombol kembali Android → popstate event → Sonara tutup overlay paling atas, BUKAN keluar app.
- Urutan prioritas tutup (paling depan dulu): context menu (⋯) → sleep timer → antrean → full player → sub-view → tab utama.
- Saat di tab utama (Home/Cari/Koleksi), tekan kembali baru benar-benar keluar app — tapi karena audio masih main di background (kalau battery optimization udah unrestricted), musik tetap jalan.

### Bug 4: Sheet Antrean & Sleep Timer susah ditutup
**Penyebab:** Sheet hanya bisa ditutup dengan tap di backdrop (area gelap luar sheet). User nggak tahu / nggak respon → stuck.

**Fix:** Tambah tombol close (X) eksplisit di:
- Header sheet **Antrean** (kanan atas)
- Header sheet **Pengatur waktu tidur** (kanan atas)
- Header **menu konteks lagu** (tombol ⋯)
- Tombol kembali Android juga bisa tutup sheet ini (Bug 3 fix).

### Bug 5: Keyboard tutup tiap ketik 1 huruf di pencarian
**Penyebab:** Tiap ketik huruf → `setState({ search })` → seluruh aplikasi re-render → element input keganti dengan element baru → keyboard kehilangan focus → keyboard tutup.

**Fix:** Search query disimpan di local variable, BUKAN state.
- Ketik huruf tidak trigger global re-render — input tetap focused.
- Hasil pencarian update via DOM patch lokal di section results aja.
- Debounce 120ms supaya pengetikan cepat tidak rebuild list per huruf.
- Hasil: keyboard tetap kebuka selama ngetik, dan list update secara live.

## Update lain
- Service Worker dinaikkan ke `sonara-v5` supaya HP auto-fetch versi baru.

## Cara update di HP setelah deploy
1. Update 6 file di GitHub (index.html, sw.js, manifest.json, icon-192, icon-512, CHANGELOG.md)
2. Tunggu Vercel re-deploy (~30 detik)
3. Di HP: buka Sonara dari home screen
4. Service worker baru otomatis install di background
5. Tutup Sonara, buka lagi → versi baru aktif

Kalau masih versi lama setelah dibuka ulang:
- Tekan lama icon Sonara di home screen → App info → Storage → Clear cache (JANGAN clear data — itu hapus lagu)

## Test checklist setelah update
- ✅ Tekan tombol kembali saat full player terbuka → full player tutup, musik tetap jalan
- ✅ Tekan tombol kembali saat di sheet Antrean → sheet tutup
- ✅ Tekan tombol kembali saat di Album/Artis → balik ke Koleksi
- ✅ Tombol X muncul di kanan atas sheet Antrean & Sleep Timer
- ✅ Buka pencarian, ketik panjang → keyboard tetap kebuka, hasil muncul live
- ✅ Tekan Home → musik tetap jalan (asal battery optimization Chrome = Unrestricted)
