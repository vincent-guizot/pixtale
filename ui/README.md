# PixTale Frontend (Next.js + Framer Motion) 🎨

Frontend web client untuk PixTale yang dibangun menggunakan **Next.js App Router**, **React 19**, **Framer Motion**, dan **Tailwind CSS**.

---

## ⚡ Fitur Utama
- **Next.js App Router**: Routing modular berbasis folder (`/`, `/login`, `/register`, `/explore`, `/create`, `/notifications`, `/profile`, `/users/[username]`).
- **Framer Motion Animations**:
  - `PageTransition`: Transisi halus antar halaman.
  - `LikeButton`: Animasi pulse/pop saat memberikan like dengan spring physics.
  - `PostCard` & `PostGridItem`: Animasi kemunculan dan interaksi hover.
  - `NotificationItem`: Animasi slide-in item notifikasi.
- **State & Data Synchronization**: Zustand untuk auth persisten & modal store; TanStack Query untuk caching dan background sync.
- **Form Management**: React Hook Form divalidasi dengan Zod schema.

---

## 💻 Menjalankan Project

```bash
# Menjalankan server development
npm run dev

# Membangun versi production
npm run build

# Menjalankan build production
npm run start

# Menjalankan automated tests
npm test
```
