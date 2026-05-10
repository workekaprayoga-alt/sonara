# Sonara — Update v2

## Apa yang baru?

### 1. Antrean (Queue) view
- Tap icon antrean di full player (kanan bawah) → muncul daftar lagu yang akan diputar
- Section **"Shuffling dari:"** muncul saat shuffle aktif (persis Spotify)
- Lagu yang sedang main di-highlight hijau dengan animasi equalizer
- Drag handle (☰) di kanan setiap lagu — bisa atur ulang urutan
- Footer: tombol Shuffle + Pengatur Waktu

### 2. Halaman Artis
- Tap nama artis di full player → buka halaman artis
- Hero image besar (auto pakai cover lagu pertama, bisa override dengan icon foto di kanan atas)
- Nama artis besar bold dengan gradient overlay
- Section **"Populer"** dengan nomor track + cover + judul + durasi
- Section **"Rilis populer"** — list album dari artis itu (tap untuk buka album)
- Tombol shuffle + play hijau besar

### 3. Halaman Album
- Tap nama album dari context menu → buka halaman album
- Cover besar di tengah dengan shadow
- Judul album, nama artis (clickable ke halaman artis), tahun rilis
- Action row: download, share, dst.
- List lagu album

### 4. Sleep Timer ⏱
- Icon timer di full player (kanan dari tombol next)
- Opsi: 5/10/15/30/45 menit, 1 jam, **Akhir lagu**
- Saat aktif, muncul countdown di full player ("Akan berhenti dalam 4:23")
- Bisa dimatikan dengan opsi "Matikan"

### 5. Blurred cover art di Full Player ✨
- Background full player sekarang pakai blurred cover art dari lagu yang main
- Persis seperti Spotify asli
- Otomatis ganti tiap lagu

### 6. Drag-reorder Playlist
- Buka playlist → tap chip "Edit"
- Drag handle (☰) muncul di kanan setiap lagu
- Drag untuk atur ulang urutan (mendukung mouse di laptop & touch di HP)

### 7. Bonus: Override foto artis & cover album
- Di halaman artis: tap icon foto di kanan atas → upload foto artis sendiri
- Di halaman album: tap icon + di action row → upload cover album sendiri
- Tetap bisa pakai default (cover lagu) kalau nggak diatur

## Cara update di Vercel
1. Extract `sonara-v2.zip`
2. Buka repo `sonara` di GitHub
3. Hapus file lama (Add file → Delete) atau timpa dengan upload baru
4. Drag 5 file baru dari zip ke GitHub
5. Commit changes
6. Vercel otomatis re-deploy dalam ~30 detik
7. Refresh app di HP — kalau tidak update, hapus Sonara dari home screen, buka link Vercel lagi, install ulang

## Tips pakai
- **Buka Antrean cepat:** dari mini player → tap → buka full player → tap icon antrean
- **Sleep timer untuk tidur:** putar musik → buka full player → tap icon timer → pilih durasi
- **Lihat artis lengkap:** dari full player, tap nama artis di bawah judul lagu
- **Atur urutan playlist:** buka playlist → tap "Edit" → drag handle untuk reorder

## Yang masih bisa ditambahkan nanti
- Lyrics view (file .lrc support)
- Equalizer (Web Audio API)
- Crossfade & gapless playback
- Statistik dengar (lagu paling sering)
- Folder/bulk import dari komputer

Kasih tahu kalau ada yang aneh atau request fitur lain!
