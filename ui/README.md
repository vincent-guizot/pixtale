# 📸 Codigram — Frontend

Frontend untuk Codigram API, dibangun sesuai desain (Home, Explore, Create Post, Notifications, Profile) dengan color palette `#112b3c / #205375 / #f66b0e / #efefef`.

## Tech Stack

- TypeScript + React 19 (Vite)
- React Router DOM (routing + protected routes)
- Tailwind CSS v4
- Komponen UI ala shadcn (ditulis manual dengan Radix UI primitives — lihat catatan di bawah)
- Zod (validasi schema)
- Zustand (state: auth & post modal)
- TanStack Query (server state, caching, cache invalidation)
- Axios (HTTP client + JWT interceptor)
- React Hook Form (form handling)

## Setup

```bash
npm install
cp .env.example .env   # isi VITE_API_BASE_URL sesuai URL backend kamu
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

## Struktur Folder

```
src/
  api/            # axios instance + 1 file per resource (posts, auth, dst)
  components/
    ui/           # primitives ala shadcn (Button, Input, Dialog, dst)
    layout/       # Header, BottomNav, AppLayout, ProtectedRoute
    posts/        # PostCard, PostGridItem, PostDetailModal, LikeButton, dst
    notifications/
    profile/
  hooks/          # TanStack Query hooks per resource
  lib/            # utils (cn, timeAgo), constants, queryClient
  pages/          # 1 komponen per halaman/route
  schemas/        # Zod schema per form
  stores/         # Zustand: authStore (persisted), postModalStore
  types/          # TypeScript types, mengikuti persis response backend
```

## Halaman

| Route | Halaman | Auth? |
|---|---|---|
| `/login` | Login | Guest only |
| `/register` | Register | Guest only |
| `/` | Home (feed) | ✅ |
| `/explore` | Explore (grid + filter kategori) | ✅ |
| `/create` | Create post | ✅ |
| `/posts/:id/edit` | Edit post (form sama dengan create) | ✅ |
| `/notifications` | Notifications | ✅ |
| `/profile` | Profile (punya sendiri) | ✅ |

Detail post (likes, comments, edit, delete) dibuka lewat **modal** (`PostDetailModal`), bisa dipicu dari post manapun (feed, grid, notification) lewat `usePostModalStore`.

## Catatan: Fitur di desain yang disesuaikan/di-skip

Backend Codigram API saat ini **belum** support fitur-fitur berikut, jadi UI-nya disembunyikan (bukan dihapus total secara desain, cuma nggak ditampilkan sampai backend-nya ada):

1. **Stories** (carousel avatar di atas feed Home) — tidak ada tabel/endpoint Stories di backend.
2. **Follow / Following system** — tidak ada tabel Follow, tidak ada follower/following count, tidak ada tombol "Following" di notifikasi.
3. **Search fungsional** — search bar di header cuma mengarahkan ke halaman Explore (filter kategori), karena backend belum punya endpoint pencarian keyword.
4. **Location & "Turn off commenting"** di form Create Post — field ini nggak ada di model `Post`, jadi dihilangkan dari form.
5. **Upload file gambar** — backend cuma nyimpen `imageUrl` (string URL), belum ada endpoint upload. Form Create Post pakai input URL gambar, bukan file picker asli.
6. **Melihat profil user lain** — endpoint `GET /profile` cuma balikin profil user yang sedang login (dari token), belum ada endpoint `GET /users/:id`. Klik username di post lain saat ini belum mengarah ke halaman profil orang tersebut.
7. **Tab "Likes" di Profile** — backend belum punya endpoint untuk ambil daftar post yang di-like user (relasi `likedPosts` ada di model tapi belum ada route/controller-nya). Cuma tab "Posts" yang ditampilkan.
8. **Like button di feed/grid** memakai strategi *smart toggle*: karena `GET /posts` (list) belum mengembalikan status "sudah saya like atau belum", tombol like akan mencoba like dulu, dan otomatis fallback ke unlike kalau backend membalas 409 (sudah pernah like). Di modal detail post, status like akurat 100% karena `GET /posts/:id` menyertakan array `likedBy`.

Kalau mau semua fitur ini fully-functional, backend perlu ditambah: tabel `Stories`, tabel `Follows` + endpoint follow/unfollow + followers/following count, endpoint search, field `location` & `commentsDisabled` di `Post`, endpoint upload file, endpoint `GET /users/:id`, dan endpoint `GET /profile/likes`.
