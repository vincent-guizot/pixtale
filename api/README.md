# 📸 Codigram API

REST API media sosial sederhana (seperti Instagram) — dibangun dengan Node.js, Express, Sequelize, dan PostgreSQL.

---

## Learning Competencies

1. Memahami arsitektur REST API production-ready
2. Menerapkan MVC pattern dengan Express
3. Menggunakan Sequelize dengan PostgreSQL
4. Membuat Authentication & Authorization (JWT)
5. Menerapkan Role & Ownership Authorization
6. Membuat relasi kompleks (1-1, 1-N, M-N)
7. Membuat dokumentasi API menggunakan Swagger

---

## Summary

**Codigram** adalah aplikasi REST API media sosial sederhana. User dapat:

- Register & Login
- Membuat Post
- Memberi kategori pada Post
- Memberi komentar
- Memberi like
- Memiliki Profile pribadi
- Mengatur akses edit/delete berdasarkan ownership

### Tech Stack

- Node.js + Express.js
- Sequelize ORM + PostgreSQL
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Swagger (API Documentation)

---

## Task 1 — Database Tables (6 Tabel)

### 1. Users

| Key       | Type         | Keterangan         |
| --------- | ------------ | ------------------- |
| id        | SERIAL       | Primary Key         |
| username  | VARCHAR(50)  | UNIQUE, NOT NULL    |
| email     | VARCHAR(100) | UNIQUE, NOT NULL    |
| password  | VARCHAR(255) | NOT NULL (hashed)   |
| role      | VARCHAR(20)  | DEFAULT 'user'      |
| createdAt | DATE         |                      |
| updatedAt | DATE         |                      |

**Relasi:** User 1—1 Profile · User 1—N Post · User 1—N Comment · User M—N Post (melalui Likes)

### 2. Profiles

| Key       | Type                            | Keterangan |
| --------- | -------------------------------- | ---------- |
| id        | SERIAL                           | Primary Key |
| fullName  | VARCHAR(100)                     |            |
| bio       | TEXT                             |            |
| avatarUrl | TEXT                             |            |
| userId    | INTEGER (FK → Users.id), UNIQUE  | NOT NULL   |

**Relasi:** User 1—1 Profile

### 3. Categories

| Key         | Type         | Keterangan |
| ----------- | ------------ | ---------- |
| id          | SERIAL       | Primary Key |
| name        | VARCHAR(100) | NOT NULL   |
| description | TEXT         |            |

**Relasi:** Category 1—N Post

### 4. Posts

| Key        | Type                          | Keterangan |
| ---------- | ----------------------------- | ---------- |
| id         | SERIAL                        | Primary Key |
| caption    | TEXT                          |            |
| imageUrl   | TEXT                          |            |
| userId     | INTEGER (FK → Users.id)       | NOT NULL   |
| categoryId | INTEGER (FK → Categories.id)  | NOT NULL   |

**Relasi:** User 1—N Post · Category 1—N Post · Post 1—N Comment · Post M—N User (melalui Likes)

### 5. Comments

| Key     | Type                     | Keterangan |
| ------- | ------------------------ | ---------- |
| id      | SERIAL                   | Primary Key |
| message | TEXT                     | NOT NULL   |
| userId  | INTEGER (FK → Users.id)  | NOT NULL   |
| postId  | INTEGER (FK → Posts.id)  | NOT NULL   |

**Relasi:** User 1—N Comment · Post 1—N Comment

### 6. Likes (Junction Table)

| Key    | Type                     |
| ------ | ------------------------ |
| userId | INTEGER (FK → Users.id)  |
| postId | INTEGER (FK → Posts.id)  |

**Primary Key gabungan:** `(userId, postId)`
> ⚠️ *Diperbaiki: pada draf sebelumnya tertulis `(employeeId, postId)` — ini typo, seharusnya `userId`.*

**Relasi:** User M—N Post

> ℹ️ Tabel `Follows` dihapus dari scope karena bukan bagian dari fitur inti (ditunda ke pengembangan lanjutan, tidak wajib dikerjakan).

### 7. Notifications

| Key         | Type                     | Keterangan |
| ----------- | ------------------------ | ---------- |
| id          | SERIAL                   | Primary Key |
| type        | VARCHAR(20)               | `'like'` atau `'comment'` |
| message     | TEXT                     | NOT NULL, contoh: "jane menyukai post kamu" |
| isRead      | BOOLEAN                  | DEFAULT false |
| recipientId | INTEGER (FK → Users.id)  | NOT NULL — pemilik post yang menerima notifikasi |
| actorId     | INTEGER (FK → Users.id)  | NOT NULL — user yang memicu (like/comment) |
| postId      | INTEGER (FK → Posts.id)  | NOT NULL |

**Relasi:** User 1—N Notification (sebagai recipient) · User 1—N Notification (sebagai actor) · Post 1—N Notification

**Logika:** Notifikasi dibuat otomatis oleh `LikeService` dan `CommentService` setiap ada like/comment baru — **kecuali** kalau user like/comment post miliknya sendiri (tidak perlu notifikasi diri sendiri).

---

## Task 2 — Relationships (Sequelize)

| # | Relasi |
|---|--------|
| 1 | `User.hasOne(Profile)` |
| 2 | `Profile.belongsTo(User)` |
| 3 | `User.hasMany(Post)` |
| 4 | `Post.belongsTo(User)` |
| 5 | `Category.hasMany(Post)` |
| 6 | `Post.belongsTo(Category)` |
| 7 | `Post.hasMany(Comment)` |
| 8 | `Comment.belongsTo(Post)` |
| 9 | `User.hasMany(Comment)` |
| 10 | `Comment.belongsTo(User)` |
| 11 | `User.belongsToMany(Post, { through: Likes })` |
| 12 | `Post.belongsToMany(User, { through: Likes })` |

---

## Task 3 — Authentication

- **bcrypt** untuk hash password
- **JWT** untuk login & session

| Method | Endpoint    | Keterangan     |
| ------ | ----------- | -------------- |
| POST   | `/register` | Register user  |
| POST   | `/login`    | Login user     |

**Ketentuan:**
- Password wajib di-hash sebelum disimpan
- Login mengembalikan `access_token`
- Token berisi `id` & `role`
- Gunakan middleware `authenticate` untuk memverifikasi token di route yang membutuhkan login

---

## Task 4 — Authorization

**Ownership Rules** — user hanya boleh:

- Update post miliknya sendiri
- Delete post miliknya sendiri
- Update profile miliknya sendiri
- Delete comment miliknya sendiri

Jika bukan pemilik → return **403 Forbidden**

**Admin:**
- Role `admin` bisa delete post siapa saja (cukup cek `req.user.role === 'admin'` di middleware ownership, tidak perlu logic terpisah)

---

## Task 5 — Routes

### Public Routes

| Method | Endpoint      | Keterangan     |
| ------ | ------------- | -------------- |
| GET    | `/`           | Home API       |
| GET    | `/posts`      | Semua post     |
| GET    | `/posts/:id`  | Detail post    |
| GET    | `/categories` | Semua kategori |

### Auth Required Routes

| Method | Endpoint        | Keterangan      |
| ------ | --------------- | --------------- |
| POST   | `/posts`        | Create post     |
| PUT    | `/posts/:id`    | Update post (owner only) |
| DELETE | `/posts/:id`    | Delete post (owner/admin only) |
| PUT    | `/profile`      | Update profile milik sendiri |
| POST   | `/comments`     | Create comment  |
| DELETE | `/comments/:id` | Delete comment (owner only) |
| POST   | `/likes/:postId`   | Like post    |
| DELETE | `/likes/:postId`   | Unlike post  |
| GET    | `/notifications`          | Semua notifikasi milik user yang login |
| PUT    | `/notifications/:id/read` | Tandai satu notifikasi sudah dibaca (owner only) |
| PUT    | `/notifications/read-all` | Tandai semua notifikasi sudah dibaca |

> ℹ️ *Ditambahkan: `PUT /profile` sebelumnya disebut di Task 4 (ownership rule) tapi belum ada di tabel routes — sekarang dilengkapi.*

---

## Task 6 — Response Format

**Success Response**
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {}
}
```

**Error Response**
```json
{
  "status": "error",
  "message": "Unauthorized",
  "details": "Invalid token"
}
```

---

## Task 7 — Swagger Documentation

Dokumentasi Swagger dibuat untuk endpoint inti:

- Register
- Login
- Create Post
- Update Post
- Delete Post
- Create Comment
- Like Post

Dapat diakses melalui: **`/api-docs`**

---

## Project Structure (MVC)

```
config/
  config.js       ← config sequelize-cli (dev/test/production)
controllers/
services/
middlewares/
models/           ← model class (Sequelize), di-load otomatis oleh models/index.js
migrations/       ← skema tabel, dijalankan via sequelize-cli
seeders/          ← data awal, dijalankan via sequelize-cli
routes/
docs/
.sequelizerc      ← beri tahu sequelize-cli lokasi folder config/models/migrations/seeders
app.js
server.js
```

> ℹ️ *Skema database sekarang dikelola sepenuhnya lewat **migration** (`sequelize-cli`), bukan lagi `sequelize.sync({ alter: true })`. Ini lebih production-ready karena setiap perubahan skema tercatat sebagai file migration yang bisa di-review, di-rollback, dan direplikasi di environment lain.*

### Menjalankan migration & seeder

```bash
npm install

# jalankan semua migration (buat 7 tabel di database Neon)
npm run migrate

# isi data awal (3 user, 4 kategori, contoh post/comment/like/notification)
npm run seed

# rollback migration terakhir / semua migration
npm run migrate:undo
npm run migrate:undo:all

# reset total: undo semua migration -> migrate ulang -> seed ulang
npm run db:reset
```

---

## Optional Bonus (Tidak Wajib)

Fitur berikut **boleh dikerjakan sebagai tantangan tambahan**, tapi di luar scope inti (level easy–medium):

1. Pagination pada `GET /posts`
2. Search post berdasarkan caption
3. Menyertakan total likes count di response post
4. Soft delete (`paranoid: true`)

---

## Final Result

Setelah menyelesaikan project ini, kamu diharapkan mampu membuat:

- REST API production-ready
- Sistem Authentication & Authorization
- Struktur database relasional yang kompleks
- Logika backend bergaya Instagram
- Dokumentasi API profesional menggunakan Swagger

---

## Ringkasan Perubahan dari Draf Awal

| Perubahan | Alasan |
|---|---|
| Fix typo primary key Likes: `employeeId` → `userId` | Bug di draf asli |
| Hapus tabel `Follows` dari scope wajib | Bukan fitur inti, ditunda |
| Pagination, search, likes count, soft delete → jadi **bonus opsional** | Terlalu berat untuk level easy–medium |
| Swagger difokuskan ke 7 endpoint inti (bukan seluruh endpoint) | Menjaga scope tetap ringan |
| Migration formal → opsional, pakai `sync({ alter: true })` | Mempercepat setup untuk belajar |
| Tambah route `PUT /profile` | Sebelumnya disebut di aturan ownership tapi tidak ada di tabel routes |
| Role admin dijelaskan lebih spesifik (delete post siapa saja) | Memperjelas implementasi, tetap sederhana |
| Tambah tabel `Notifications` + endpoint `/notifications` | Fitur tambahan: user dapat info saat post-nya di-like/comment orang lain |
| Skema database dipindah dari `sync({ alter: true })` ke migration `sequelize-cli` | Lebih production-ready: perubahan skema tercatat, bisa di-rollback dan direplikasi antar environment |
| Ganti `bcrypt` → `bcryptjs` | `bcrypt` butuh native binding (`.node`) yang sering gagal ter-compile/ter-download di Windows (`Cannot find module ...bcrypt_lib.node`). `bcryptjs` pure JavaScript, API-nya identik, tidak butuh build tools apa pun |
