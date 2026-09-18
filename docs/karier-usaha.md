# Karier & Usaha — operasi dan deployment

## Implementasi

Data produksi memakai `public.opportunities`; data dummy telah dihapus. Halaman list dan detail dinamis, hanya membaca `published` dengan publishable key dan RLS. Search dan filter dijalankan pada data published; pembacaan dipaginasi per 500 baris agar tidak terpotong batas default API. Jika direktori tumbuh besar, pindahkan pencarian/filter dan pagination ke server.

Migration baru: `supabase/migrations/20260918140000_opportunity_production.sql`. Baseline tidak diubah. Migration menambahkan index status/created_at, type/created_at, created_at, trigger slug/timestamp, bucket, policy Storage, dan rate limiter atomik. Slug memakai judul yang dinormalisasi + UUID penuh untuk menghindari benturan judul, termasuk kiriman bersamaan. Unique index slug baseline dipertahankan.

## Environment

| Variable | Penggunaan |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project; boleh tersedia di browser |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Pembacaan publik dengan RLS |
| `SUPABASE_SECRET_KEY` | Secret key Supabase `sb_secret_...` (atau legacy service_role), hanya server |
| `OPPORTUNITY_ADMIN_PASSWORD` | Password acak minimal 32 karakter, sekaligus kunci HMAC sesi admin |

Dua variable server sudah dikonfigurasi di `.env.local` yang diabaikan Git: secret diperoleh melalui CLI project yang sudah login, dan password admin dibuat acak 48 byte. Nilainya tidak dicetak atau disalin ke dokumentasi. Baca file lokal tersebut sendiri untuk login; jangan kirim nilainya melalui chat, commit, atau screenshot. Tidak ada secret dengan prefix `NEXT_PUBLIC_`.

## Submission dan upload

1. Form lowongan/usaha berbagi validator yang sama dengan server: required, panjang field, URL HTTP(S) tanpa credential, WhatsApp, jenis pekerjaan, tanggal kalender, MIME/ukuran/signature file.
2. `POST /api/opportunities` memeriksa origin, content type, rate limit, dan ukuran body streaming sebelum memproses form.
3. Server mengupload gambar opsional ke bucket privat `opportunity-images`, path `<UUID posting>/<UUID file>.<ext>`, tanpa upsert. Hanya JPEG, PNG, WebP; maksimal **3 MiB**. Batas ini menyisakan ruang multipart di bawah batas Vercel 4,5 MB.
4. Server menginsert field yang diizinkan saja, selalu `status=pending`, `published_at=null`. Trigger database memaksakan kondisi ini lagi, termasuk untuk insert privileged.
5. Jika insert gagal, server memeriksa apakah insert sebenarnya sudah committed. Jika belum ada row dan pemeriksaan berhasil, file dihapus melalui Storage API. Jika hasil insert tidak dapat dipastikan atau cleanup gagal, path dicatat di log untuk diperiksa pengurus. Kegagalan proses mendadak tetap dapat meninggalkan orphan; jangan menghapus metadata `storage.objects` melalui SQL. Periksa bahwa tidak ada opportunity dengan `image_url` tersebut sebelum menghapus file melalui Storage API/Dashboard.
6. Success baru ditampilkan setelah database mengonfirmasi insert. Pending tidak muncul di list/detail publik.

Rate limit: 5 submission per 15 menit, 10 percobaan login per 15 menit. Pada Vercel, alamat diambil dari `x-vercel-forwarded-for` yang ditetapkan platform. Di luar Vercel dipakai satu limit bersama, bukan mempercayai forwarded header dari pengunjung. Sesuaikan integrasi trusted proxy jika dipindahkan ke hosting lain. Tidak ada CAPTCHA; untuk trafik spam terdistribusi, tambahkan perlindungan platform/CAPTCHA sesuai kebutuhan.

## RLS dan Storage

- Public/anon/authenticated hanya punya SELECT opportunities dengan `status='published'`.
- Policy INSERT publik baseline dihapus; user anonim tetap dapat submit melalui endpoint server yang tervalidasi. INSERT langsung dari browser, UPDATE, dan DELETE tabel ditolak, sehingga validasi/rate limit tidak bisa dilewati melalui PostgREST.
- Storage privat: SELECT hanya untuk gambar yang direferensikan row published. Tidak ada policy upload/update/delete publik; upload dilakukan server atas permintaan submission.
- Gambar publik dilayani `/api/opportunities/[id]/image` memakai publishable key + RLS, tanpa cache. `next/image` memakai `unoptimized` untuk menghindari cache optimizer yang dapat mempertahankan gambar setelah status dicabut.
- Pending/rejected hanya dapat dipreview melalui route admin yang memverifikasi sesi setiap request.
- Tabel rate limit mengaktifkan RLS, tanpa policy publik; RPC hanya dapat dipanggil service_role.
- Service/secret client ditandai `server-only`, tidak memakai cookie sesi pengguna.

## Moderasi

Buka `/admin/karier-usaha`, login memakai password dari environment lokal/Vercel. Sesi HMAC berlaku 8 jam dengan cookie HttpOnly, SameSite=Strict, Secure pada production. Setiap server action memverifikasi sesi; Next.js juga memeriksa origin Server Actions. Admin tidak menggunakan Supabase Auth tambahan.

Daftar pending dipaginasi 25 item dan menyediakan preview data/gambar. Publish mengubah hanya row yang masih pending menjadi `published`, dengan `published_at=now()` melalui trigger. Reject mengubahnya menjadi `rejected` dan mengosongkan timestamp publikasi. Mutasi bersamaan tidak dapat menimpa hasil moderasi sebelumnya. Halaman publik direvalidasi setelah perubahan.

Admin juga dapat memilih tab Pending, Published, atau Rejected. Tombol **Hapus** pada setiap posting meminta konfirmasi sebelum memanggil server action yang memverifikasi sesi admin. Path gambar diambil dari database, bukan dari input client. File di `opportunity-images` dihapus lebih dahulu, kemudian row dihapus; tidak memerlukan migration atau policy publik tambahan.

Jika Storage gagal atau responsnya tidak pasti, row tidak dihapus dan admin mendapat pesan untuk mencoba lagi. Jika file sudah dihapus tetapi penghapusan row gagal, server mencoba mengosongkan referensi gambar lama agar row tidak menunjuk file yang hilang. Pembaruan ini bersyarat pada path lama, sehingga tidak menimpa gambar yang berubah bersamaan. Jika perbaikan database ikut gagal, pesan kegagalan parsial ditampilkan dan ID posting dicatat di log untuk retry. Kedua layanan tidak memiliki transaksi bersama; kegagalan proses mendadak tetap memerlukan pengulangan Hapus. File yang sudah tidak ada dapat dilewati saat retry. Success hanya ditampilkan setelah row berhasil dihapus atau dikonfirmasi sudah tidak ada. Halaman list/detail/admin direvalidasi.

Tes penghapusan: `node --test tests/opportunity-deletion.test.mjs` menguji urutan operasi dan kegagalan Storage/database/perbaikan. Dengan aplikasi lokal pada port 3100, jalankan `node --env-file=.env.local tests/opportunity-delete-live.mjs` untuk menguji penghapusan dengan sesi admin, penolakan tanpa sesi, file nyata/tanpa gambar/file yang sudah hilang, ketiga status posting, dan pengulangan penghapusan. Password admin aplikasi dan test harus sama serta minimal 32 karakter. Script membersihkan hanya fixture run tersebut.

Logout menghapus cookie browser. Rotasi `OPPORTUNITY_ADMIN_PASSWORD` mencabut seluruh sesi, termasuk salinan cookie yang belum kedaluwarsa. Ini admin bersama untuk MVP, belum mencakup akun individual, MFA, atau audit actor per pengurus. Tanpa environment valid, login/mutasi ditutup; tidak ada bypass admin.

## Verifikasi yang telah dijalankan

- `npx supabase db push --dry-run`: hanya migration baru terdeteksi.
- `npx supabase db push`: berhasil; bucket dan policies diverifikasi remote.
- `npx supabase db query --linked --file tests/opportunities-rls.sql`: lulus; fixture di-rollback. Menguji forced pending, slug unik, RLS anon/authenticated, larangan mutasi langsung, timestamp publish/reject, bucket privat, dan rate limiter.
- `node --test tests/opportunity-validation.test.mjs`: 8 tes lulus, termasuk filter/search, tanggal, WhatsApp, URL, gambar palsu/oversize/SVG.
- `node --env-file=.env.local tests/opportunity-live.mjs`: 5 kelompok tes HTTP end-to-end lulus pada aplikasi lokal port 3100 dan Supabase remote. Mencakup submit job/business, upload nyata, isolasi pending, URL/gambar invalid, login/preview admin, penolakan moderasi tanpa sesi, publish/reject, list published, detail slug, dan visibilitas gambar. Semua row/file fixture run dihapus melalui API.
- `npm run lint` dan `npm run build`: lulus. Percobaan build pertama di sandbox gagal mengunduh Google Fonts; build dengan akses jaringan berhasil.

Untuk mengulang integrasi: build, jalankan `npm run start -- --port 3100`, lalu jalankan script live di atas. Script memakai kredensial lokal dan membuat posting sementara; fixture selalu dibersihkan pada blok finally. Pilih waktu uji yang sesuai karena posting published sementara dapat terlihat selama tes. Uji live memakai 4 slot submission dan 1 slot login; tunggu 15 menit sebelum mengulang bila terkena limiter. Pengujian ini menggunakan HTTP, bukan otomasi visual browser.

## Sebelum production di Vercel

1. Set empat environment variable di atas pada environment deployment yang sesuai. Secret/password **tidak** memakai prefix `NEXT_PUBLIC_`. Gunakan environment terpisah untuk Preview jika tidak boleh mengirim posting ke database production.
2. Redeploy agar konfigurasi dan bundle public env terbaru berlaku. Migration remote sudah diterapkan; tidak perlu membuat bucket/policy/SQL manual.
3. Gunakan HTTPS, simpan password admin di password manager, dan login `/admin/karier-usaha`. Batasi aksesnya ke pengurus; rotasi password jika akses dibagikan tidak semestinya.
4. Smoke-test domain Vercel: submit, preview, publish/reject, list/detail/gambar. Validasi visual/responsif form di browser dan monitor log upload/cleanup serta limit penggunaan Storage.

Deployment production dilakukan terpisah melalui Vercel setelah environment variables disiapkan; jangan deploy melalui CLI.

## Inventaris file

File baru:

- `supabase/migrations/20260918140000_opportunity_production.sql`
- `src/lib/supabase/{browser,server,admin}.ts`
- `src/lib/{opportunities,opportunity-validation,opportunity-filters,opportunity-security}.ts`
- `src/types/database.ts` (kontrak schema baseline + RPC; mapping terpisah ke model UI existing)
- `src/app/api/opportunities/route.ts`, `src/app/api/opportunities/[id]/image/route.ts`
- `src/app/admin/karier-usaha/{page.tsx,actions.ts}`, `src/app/admin/karier-usaha/image/[id]/route.ts`
- `src/app/karier-usaha/{error,loading}.tsx`
- `src/components/career-business/OpportunitySubmissionForm.tsx`
- `tests/{opportunity-validation.test.mjs,opportunity-live.mjs,opportunities-rls.sql}`
- `docs/karier-usaha.md`

File existing yang diubah:

- `src/app/karier-usaha/page.tsx` dan `[slug]/page.tsx`: data Supabase, dynamic rendering, 404, tautan opsional, gambar dengan kontrol akses.
- `src/components/career-business/{CareerBusinessExplorer,JobSubmissionForm,BusinessSubmissionForm,ImageUploadPreview,JobCard,BusinessCard,SubmissionModal}.tsx`: data nyata, form bersama, validasi/upload, perbaikan copy.
- `README.md`: tautan dokumentasi.
- `.env.local`: dua variable server ditambahkan; tetap ignored dan tidak tracked.

`src/data/opportunities.ts` dihapus karena seluruh isinya dummy. Perubahan `package.json`/`package-lock.json` dan folder Supabase baseline sudah ada sebelum pekerjaan ini; dependency tidak diubah lagi. Migration baseline dipertahankan apa adanya.

Referensi: [Supabase Storage privat/RLS](https://supabase.com/docs/guides/storage/buckets/fundamentals), [batas request Vercel](https://vercel.com/docs/functions/limitations).
