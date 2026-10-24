# PixTale 📸

PixTale adalah platform media sosial visual modern yang terbagi ke dalam arsitektur decoupled: backend REST API dan frontend berbasis Next.js dengan animasi interaktif Framer Motion.

---

## 🏛️ Arsitektur Proyek

```
pixtale/
├── api/             # Backend REST API (Node.js + Express + Sequelize + PostgreSQL)
└── ui/              # Frontend Web Client (Next.js 16 + React 19 + Framer Motion + Tailwind CSS)
```

---

## 🚀 Tech Stack

### Backend (`api`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL, Sequelize ORM, Sequelize CLI
- **Autentikasi**: JWT (JSON Web Tokens), Bcrypt password hashing
- **File Upload**: Multer (mendukung format jpeg, png, webp, gif)
- **Dokumentasi**: Swagger / OpenAPI (`/docs`)
- **Testing**: Node.js Native Test Runner (`node --test`)

### Frontend (`ui`)
- **Framework**: Next.js 16 (App Router) + React 19
- **Animasi**: Framer Motion (Page transitions, like pulse, hover animations)
- **Styling**: Tailwind CSS v4, PostCSS
- **Komponen**: Radix UI Primitives, Lucide Icons
- **State Management**: Zustand (Auth store & Post modal store)
- **Data Fetching**: TanStack React Query + Axios
- **Form & Validasi**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 🛠️ Panduan Memulai (Development)

### 1. Menjalankan Backend API
```bash
cd api
npm install
npm run dev
```
API akan berjalan di `http://localhost:3000`. Dokumentasi Swagger dapat diakses di `http://localhost:3000/docs`.

### 2. Menjalankan Frontend UI (Next.js)
```bash
cd ui
npm install
npm run dev
```
Aplikasi web Next.js akan berjalan di `http://localhost:3000` (atau port alternatif jika port 3000 dipakai).

---

## 🧪 Menjalankan Automated Tests

### Test Backend API
```bash
cd api
npm test
```
Menjalankan 28 unit & integration test suites untuk middlewares (`authenticate`, `authorizeAdmin`, `optionalAuth`, `errorHandler`, `upload`), utils (`ApiResponse`, `AppError`, `JwtUtil`), dan validasi service.

### Test Frontend UI
```bash
cd ui
npm test
```
Menjalankan test suite berbasis Vitest dan Testing Library untuk utilitas, Zustand stores, serta render komponen dan animasi Framer Motion.
