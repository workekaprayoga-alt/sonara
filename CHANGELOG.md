# Sonara v5.1 — Polish patch

Patch buat 2 hal yang masih kurang halus di v5.

## 🐛 Bug fix

### Full Player "muncul lagi dari bawah" saat sheet ditutup
**Yang kamu lihat:** Tutup sheet Antrean / Sleep Timer / Context Menu (⋯) → Full Player di belakangnya kelihatan slide-up lagi dari bawah, kayak baru kebuka — padahal seharusnya cuma sheet di depan yang nutup.

**Penyebab:** Setiap `setState` trigger DOM rebuild, dan element Full Player punya class `animate-slide-up`. Tiap kali element Full Player baru dibuat (re-render), animasi re-trigger.

**Fix:** Track timestamp kapan Full Player BENAR-BENAR baru dibuka (transisi tutup → buka). Animasi `slide-up` cuma dipasang dalam window 500ms pertama setelah benar-benar dibuka. Kalau re-render terjadi setelah itu (misal karena sheet di atasnya ditutup), Full Player muncul tanpa animasi — di tempat yang sama, nggak loncat.

Hasilnya: tutup sheet sekarang cuma sheet-nya yang slide-down. Full Player diam di belakang, kayak seharusnya.

## ✨ Polish

### Animasi sheet close lebih "berlapis"
Feedback: "smooth itu bukan cepat tapi ada alurnya gitu, jangan tiba-tiba nutup"

**Sebelum:** durasi 240ms / 280ms dengan easing `cubic-bezier(0.32, 0.72, 0, 1)` yang cenderung snappy.

**Sekarang:**
- Sheet close: 240ms → **340ms**
- Full Player close: 280ms → **380ms**
- Sheet open: 320ms → **380ms**
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` — deceleration kurva yang lebih halus, "ngeluncur dengan tenang", bukan "snap turun".

### Animasi lirik LRC jauh lebih smooth
**Sebelum:** Baris aktif berubah dari `text-white/40` → `text-white text-xl` instant (color jump + size jump).

**Sekarang:**
- Transisi 600ms — lambat dan halus, mata bisa ngikutin
- Bukan cuma 2 state (aktif vs nggak aktif), tapi **gradient opacity 4 level** berdasarkan jarak dari baris aktif:
  - Aktif: 100% opacity, scale 1.05, font bold
  - Tetangga (±1): 85% opacity, scale 0.98
  - Sekitar (±2-3): 65% opacity, scale 0.96
  - Jauh (>3): 45% opacity, scale 0.94
- Plus efek scale halus saat baris aktif berubah — kayak baris "naik ke depan"

Hasilnya feel-nya kayak Spotify atau Musixmatch.

### Lirik panel show/hide
- Fade in/out: 300ms → **500ms** (lebih elegan)

## ⚙️ Update teknis
- Service Worker dinaikkan ke `sonara-v9`

## Cara update
1. Update file di GitHub (terutama index.html + sw.js)
2. Tunggu Vercel redeploy ~30 detik
3. Di HP: tutup Sonara, buka lagi → SW auto-update

Kalau masih lama: tekan lama icon → App info → Storage → Clear cache (jangan Clear data).

## Test checklist
- ✅ Buka lagu → tap mini player → full player muncul slide-up halus
- ✅ Di full player, tap ⋯ → context menu muncul dari bawah
- ✅ Tutup context menu (X atau backdrop) → SHEET-nya yang slide-down halus, FULL PLAYER **diam** di belakang (tidak muncul lagi dari bawah)
- ✅ Buka antrean dari mini player saat full player ke-tutup → smooth, sheet only
- ✅ Lirik LRC: pergantian baris kerasa "ngalir", bukan loncat-loncat
