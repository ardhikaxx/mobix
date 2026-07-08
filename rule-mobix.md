# RULE-MOBIX.md
## Blueprint Arsitektur Sistem — Mobix: *"One Place for Every App"*

> Dokumen ini adalah blueprint arsitektur teknis lengkap untuk platform **Mobix**, sebuah website distribusi aplikasi mobile berbasis komunitas (community-driven app store) yang dibangun menggunakan **Next.js (App Router)** dan **Firebase** (Authentication, Firestore, Storage) tanpa backend server terpisah. Dokumen ini menjadi acuan utama sebelum implementasi kode dimulai, mengikuti konvensi `rule-*.md` → `design-*.md`.

---

## Daftar Isi

1. Ringkasan Eksekutif
2. Prinsip & Filosofi Desain Sistem
3. Tech Stack
4. Firebase Project Setup
5. Arsitektur Autentikasi
6. Role & Access Matrix
7. Struktur Routing (App Router)
8. Data Model — Firestore Schema
9. Struktur Firebase Storage
10. Firestore Security Rules
11. Firebase Storage Security Rules
12. Rincian Halaman & Fitur
13. Alur Upload Aplikasi
14. Alur Download Aplikasi
15. State Management & Data Fetching
16. Komponen Reusable
17. Sistem Notifikasi & Loading State
18. Strategi Pencarian (Search)
19. Performa & SEO
20. Validasi & Error Handling
21. Statistik & Counter (Denormalisasi Data)
22. Environment Variables & Deployment
23. Roadmap Pengembangan Lanjutan
24. Checklist Implementasi

---

## 1. Ringkasan Eksekutif

**Mobix** adalah platform web tempat pengguna dapat **mengunggah** dan **mengunduh** aplikasi Android (APK) yang dibuat oleh komunitas pengguna itu sendiri — bukan aplikasi dari developer resmi seperti di Play Store, melainkan aplikasi yang diunggah oleh sesama pengguna terdaftar. Mobix berperan sebagai *"Play Store pribadi"* yang sepenuhnya digerakkan oleh kontribusi penggunanya (user-generated app catalog).

**Positioning:**
- Guest → hanya bisa **melihat & membaca** katalog aplikasi (read-only discovery).
- User (login) → bisa **mengunduh**, **mengunggah**, **mengelola** aplikasi miliknya, dan melihat statistik.

**Karakteristik arsitektur utama:**
- **Serverless-first** — tidak ada backend custom (Express/Laravel dsb). Seluruh operasi CRUD dilakukan langsung dari client menggunakan Firebase SDK, diamankan oleh Firestore & Storage Security Rules.
- **BaaS (Backend-as-a-Service)** penuh — Firebase Authentication sebagai identity provider, Firestore sebagai database utama, Firebase Storage sebagai object storage untuk logo, screenshot, dan file APK.
- **Hybrid rendering** — kombinasi Server Component (untuk konten publik yang butuh SEO) dan Client Component (untuk interaksi yang bergantung pada Firebase Client SDK & status login).

---

## 2. Prinsip & Filosofi Desain Sistem

| Prinsip | Penjelasan |
|---|---|
| **No-login browsing, login-to-act** | Guest bebas menjelajah katalog, tapi setiap aksi yang menyentuh data (download, upload, edit, hapus) wajib autentikasi. |
| **Ownership-based access control** | Setiap dokumen `apps` terikat pada `ownerId` (UID). Hanya pemilik yang boleh mengubah/menghapus data miliknya — ditegakkan di level Security Rules, bukan hanya di UI. |
| **Security Rules sebagai backend sesungguhnya** | Karena tidak ada server custom, Firestore Rules & Storage Rules-lah yang menjadi lapisan keamanan utama, bukan validasi di client. |
| **Denormalisasi terkontrol** | Data seperti `ownerName`, `downloadCount`, `appCount` didenormalisasi ke dokumen terkait agar query cepat tanpa join (Firestore tidak mendukung join native). |
| **Progressive enhancement UX** | Skeleton loading, optimistic UI, dan toast feedback di setiap aksi async agar pengalaman terasa instan meski jaringan lambat (relevan untuk target pengguna Indonesia dengan koneksi bervariasi). |
| **Mobile-first, App Router native** | Layout dan navigasi dirancang agar terasa seperti aplikasi (drawer, bottom-friendly action button) di perangkat mobile, mengingat mayoritas trafik distribusi APK datang dari mobile browser. |

---

## 3. Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG/ISR untuk halaman publik (SEO), Route Handler untuk endpoint ringan, Middleware untuk proteksi route |
| Bahasa | **TypeScript** | Type-safety untuk schema Firestore & props komponen |
| Styling | **Tailwind CSS** | Utility-first, ringan, responsif, mudah dikembangkan tim kecil |
| Auth & DB | **Firebase Authentication, Firestore, Firebase Storage** | BaaS penuh sesuai kebutuhan "tanpa backend terpisah" |
| Form & Validasi | **React Hook Form + Zod** | Validasi realtime, type-safe schema, terintegrasi baik dengan komponen terkontrol |
| Data Fetching / Cache | **SWR** (atau TanStack Query) | Caching, revalidation, dan realtime-friendly wrapper di atas `onSnapshot`/`getDocs` |
| Global State | **React Context (`AuthProvider`)** + **Zustand** (opsional untuk UI state seperti drawer, filter aktif) | Auth state dibutuhkan di seluruh pohon komponen; Zustand ringan untuk state UI lintas komponen tanpa boilerplate Context |
| Notifikasi | **react-hot-toast** atau **sonner** | Toast ringan, mendukung warna kustom sesuai spesifikasi (hijau/kuning/merah) |
| Icon | **lucide-react** | Konsisten dengan ekosistem Tailwind, tree-shakeable |
| Animasi | **Framer Motion** (opsional) | Transisi halaman & skeleton yang halus |
| Utilitas | `clsx`, `date-fns`, `nanoid` | Class merging, format tanggal, generate slug/ID pendek |
| Deployment | **Vercel** | Native support Next.js App Router, edge caching, preview deployment per PR |

```bash
npm install firebase zod react-hook-form @hookform/resolvers swr zustand \
  react-hot-toast lucide-react clsx date-fns nanoid framer-motion
```

---

## 4. Firebase Project Setup

### 4.1 Environment Variables

Meskipun `apiKey` Firebase **bukan rahasia** (didesain untuk ter-embed di client dan dibatasi oleh Security Rules + domain restriction di Google Cloud Console), tetap disarankan menyimpannya di `.env.local` — bukan hardcode langsung di kode — agar konfigurasi mudah dibedakan antar environment (development/staging/production) dan tidak ikut ter-commit sembarangan ke riwayat git publik.

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDMOKjyBiB-qOOsIJ5TW2Uw73JvymR7FC0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mobix-71e46.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mobix-71e46
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mobix-71e46.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=284473395354
NEXT_PUBLIC_FIREBASE_APP_ID=1:284473395354:web:79c4611dfabf57dddb3723
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-T916QXV3Q5
```

> ⚠️ **Catatan keamanan tambahan:** batasi `apiKey` di Google Cloud Console → API restrictions agar hanya bisa dipakai untuk Firebase API tertentu, dan pastikan domain produksi terdaftar di **Firebase Auth → Authorized Domains**. Ini adalah lapisan pertahanan tambahan, bukan pengganti Security Rules.

### 4.2 `lib/firebase/client.ts`

```ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Mencegah re-inisialisasi saat Fast Refresh / multiple import
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics hanya berjalan di browser
export const getAnalyticsIfSupported = async () => {
  if (typeof window === "undefined") return null;
  return (await isSupported()) ? getAnalytics(firebaseApp) : null;
};
```

### 4.3 `lib/firebase/admin.ts` (opsional, untuk SSR/ISR halaman publik & session cookie)

```ts
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const adminAuth = getAuth(getAdminApp());
export const adminDb = getFirestore(getAdminApp());
```

> Modul ini **server-only** (tidak boleh diimpor di Client Component). Digunakan untuk dua kebutuhan opsional: (1) generate metadata SEO di Server Component untuk halaman detail aplikasi, dan (2) memverifikasi session cookie di Middleware (lihat Bagian 5.3).

---

## 5. Arsitektur Autentikasi

### 5.1 Metode Login

| Metode | Firebase API |
|---|---|
| Register Email & Password | `createUserWithEmailAndPassword()` |
| Login Email & Password | `signInWithEmailAndPassword()` |
| Login/Register Google | `signInWithPopup(auth, new GoogleAuthProvider())` |

Saat register (baik email maupun Google), sistem otomatis membuat dokumen `users/{uid}` di Firestore jika belum ada (first-time login check), menyimpan `displayName`, `email`, `photoURL`, `provider`, dan counter awal (`appCount: 0`, `totalDownloads: 0`).

### 5.2 Auth State Listener (Global)

```ts
// context/AuthProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

type AuthContextType = { user: User | null; loading: boolean };
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

`AuthProvider` dipasang di `app/layout.tsx` (root) agar status login tersedia di seluruh pohon komponen, termasuk `Navbar` untuk menampilkan tombol Login/Register vs menu Profile.

### 5.3 Proteksi Route — Dua Pendekatan

Firebase Client SDK menyimpan status login di **IndexedDB browser**, bukan di cookie yang bisa dibaca Next.js Middleware secara langsung. Karena spesifikasi awal menyebut "Middleware digunakan untuk proteksi halaman", perlu diklarifikasi dua level implementasi:

**A. Client-Side Guard (MVP — direkomendasikan untuk tahap awal)**
Komponen pembungkus yang mengecek `useAuth()` saat mount, menampilkan skeleton saat `loading`, dan redirect ke `/login` jika `user === null`. Cepat diimplementasikan, konsisten dengan filosofi "tanpa backend terpisah".

```tsx
// components/auth/AuthGuard.tsx
"use client";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=" + window.location.pathname);
  }, [user, loading, router]);

  if (loading || !user) return <DashboardSkeleton />;
  return <>{children}</>;
}
```

**B. Session Cookie + Middleware (production-grade, opsional/roadmap)**
Setelah login di client, kirim ID token ke Route Handler `app/api/session/route.ts` yang memverifikasinya via `firebase-admin` (`verifyIdToken`) lalu membuat **session cookie** (`adminAuth.createSessionCookie`) dan menyimpannya sebagai HTTP-only cookie. `middleware.ts` kemudian bisa membaca keberadaan cookie ini untuk memblokir akses ke route privat **sebelum** halaman dirender — mencegah flash of protected content. Pendekatan ini lebih aman namun menambah kompleksitas; direkomendasikan sebagai peningkatan tahap 2 (lihat Roadmap §23).

```ts
// middleware.ts (opsional — Pendekatan B)
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("__session")?.value;
  const isProtected = PROTECTED_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));

  if (isProtected && !sessionCookie) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"] };
```

> **Rekomendasi:** mulai dengan Pendekatan A untuk MVP. Pendekatan B ditambahkan setelah fitur inti stabil, karena membutuhkan `firebase-admin` credential di server (service account) yang menambah permukaan konfigurasi.

---

## 6. Role & Access Matrix

| Aksi | Guest | User (Login) | Pemilik Aplikasi |
|---|---|---|---|
| Melihat landing page & katalog | ✅ | ✅ | ✅ |
| Melihat detail aplikasi (deskripsi, screenshot, kategori, jumlah download) | ✅ | ✅ | ✅ |
| Mencari & filter kategori | ✅ | ✅ | ✅ |
| Download APK | ❌ (dialog auth) | ✅ | ✅ |
| Upload aplikasi baru | ❌ (dialog auth) | ✅ | ✅ |
| Edit aplikasi | ❌ | ❌ (bukan miliknya) | ✅ |
| Hapus aplikasi | ❌ | ❌ (bukan miliknya) | ✅ |
| Akses Dashboard/Profile/Settings | ❌ | ✅ | ✅ |
| Update versi APK | ❌ | ❌ | ✅ |

---

## 7. Struktur Routing (App Router)

```
app/
├─ layout.tsx                          # Root layout: AuthProvider, Toaster, Navbar, Footer
├─ globals.css
├─ page.tsx                            # Landing Page (adaptif guest/user)
│
├─ (public)/
│  ├─ apps/
│  │  └─ [slug]/
│  │     └─ page.tsx                   # Detail Aplikasi — SSR/ISR untuk SEO
│  ├─ category/
│  │  └─ [categorySlug]/page.tsx       # Katalog per kategori
│  ├─ search/page.tsx                  # Hasil pencarian
│  ├─ about/page.tsx
│  ├─ login/page.tsx
│  └─ register/page.tsx
│
├─ (protected)/
│  ├─ dashboard/
│  │  ├─ page.tsx                      # Ringkasan akun & statistik
│  │  ├─ apps/
│  │  │  ├─ page.tsx                   # My Applications (list + CRUD)
│  │  │  └─ [appId]/
│  │  │     └─ edit/page.tsx           # Edit aplikasi
│  │  └─ upload/page.tsx               # Upload App
│  ├─ profile/page.tsx
│  └─ settings/page.tsx
│
└─ api/
   ├─ session/route.ts                 # (opsional) mint session cookie
   └─ og/[slug]/route.tsx              # (opsional) generate Open Graph image dinamis
```

| Path | Akses | Rendering | Deskripsi |
|---|---|---|---|
| `/` | Publik | Client + Server hybrid | Landing page, tampilan berbeda guest/user via `useAuth` |
| `/apps/[slug]` | Publik | ISR (`revalidate: 300`) | Detail aplikasi, SEO-friendly, tombol download memicu auth check |
| `/category/[categorySlug]` | Publik | Server Component + client pagination | Filter katalog per kategori |
| `/search` | Publik | Client Component | Pencarian realtime |
| `/login`, `/register` | Publik | Client Component | Form auth, redirect otomatis jika sudah login |
| `/dashboard` | Privat | Client Component + `AuthGuard` | Ringkasan & statistik akun |
| `/dashboard/apps` | Privat | Client Component + `AuthGuard` | Daftar aplikasi milik user |
| `/dashboard/upload` | Privat | Client Component + `AuthGuard` | Form upload aplikasi baru |
| `/dashboard/apps/[appId]/edit` | Privat | Client Component + `AuthGuard` + ownership check | Edit aplikasi |
| `/profile`, `/settings` | Privat | Client Component + `AuthGuard` | Kelola profil & preferensi akun |

---

## 8. Data Model — Firestore Schema

### 8.1 Koleksi `users/{uid}`

| Field | Tipe | Keterangan |
|---|---|---|
| `uid` | string | Sama dengan document ID, disimpan ulang untuk kemudahan query group |
| `displayName` | string | |
| `email` | string | |
| `photoURL` | string \| null | |
| `provider` | `"password" \| "google.com"` | |
| `bio` | string \| null | |
| `website` | string \| null | |
| `githubUsername` | string \| null | |
| `appCount` | number | Counter, di-increment atomik saat upload/hapus |
| `totalDownloads` | number | Counter agregat seluruh aplikasi milik user |
| `status` | `"active" \| "suspended"` | Untuk moderasi (roadmap) |
| `role` | `"user" \| "admin"` | Default `"user"` |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp | |

### 8.2 Koleksi `apps/{appId}`

| Field | Tipe | Keterangan |
|---|---|---|
| `appId` | string | Sama dengan document ID |
| `ownerId` | string | UID pemilik — kunci utama untuk Security Rules |
| `ownerName` | string | Denormalisasi dari `users` agar App Card tak perlu extra fetch |
| `ownerPhotoURL` | string \| null | Denormalisasi |
| `name` | string | Nama aplikasi |
| `slug` | string | URL-friendly & unik, contoh: `kasklik-akuntansi-abc123` |
| `shortDescription` | string | Maks ±150 karakter, tampil di App Card |
| `longDescription` | string | Deskripsi lengkap di halaman detail |
| `category` | string | Salah satu dari `CATEGORY_ENUM` (§8.4) |
| `tags` | string[] | Tag bebas dari pengguna |
| `searchKeywords` | string[] | Token pencarian (lihat §18) |
| `logoURL` | string | URL Firebase Storage |
| `screenshots` | string[] | Array URL Storage (opsional, bisa kosong) |
| `apkURL` | string | URL file APK versi aktif |
| `apkFileName` | string | |
| `apkSizeBytes` | number | |
| `version` | string | Contoh `"1.2.0"` |
| `versionCode` | number | Integer naik untuk deteksi update |
| `minAndroidVersion` | string | Contoh `"Android 8.0 (API 26)"` |
| `changelog` | string | Catatan rilis versi aktif |
| `websiteURL` | string \| null | |
| `githubURL` | string \| null | |
| `downloadCount` | number | Counter atomik |
| `viewCount` | number | Counter atomik |
| `status` | `"published" \| "draft" \| "suspended"` | |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp | |
| `lastVersionUpdateAt` | Timestamp | |

### 8.3 Sub-koleksi `apps/{appId}/versions/{versionId}` *(opsional, roadmap versioning)*

| Field | Tipe |
|---|---|
| `version` | string |
| `versionCode` | number |
| `apkURL` | string |
| `apkSizeBytes` | number |
| `changelog` | string |
| `createdAt` | Timestamp |

### 8.4 Koleksi `downloads/{downloadId}` *(log riwayat, untuk statistik & histori)*

| Field | Tipe | Keterangan |
|---|---|---|
| `appId` | string | |
| `appName` | string | Denormalisasi |
| `appVersion` | string | Versi yang diunduh |
| `userId` | string | UID pengunduh |
| `ownerId` | string | UID pemilik aplikasi (mempermudah agregasi statistik pemilik) |
| `downloadedAt` | Timestamp | |

### 8.5 Kategori — Konstanta Statis (bukan koleksi Firestore)

Untuk MVP, kategori didefinisikan sebagai konstanta TypeScript (bukan koleksi Firestore) karena jarang berubah dan menghindari extra read setiap load halaman:

```ts
// lib/constants/categories.ts
export const CATEGORIES = [
  { slug: "productivity", label: "Productivity" },
  { slug: "tools", label: "Tools & Utilities" },
  { slug: "games", label: "Games" },
  { slug: "social", label: "Social" },
  { slug: "finance", label: "Finance" },
  { slug: "health", label: "Health & Fitness" },
  { slug: "education", label: "Education" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "photography", label: "Photography" },
  { slug: "other", label: "Other" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];
```

> Jika di masa depan admin butuh menambah kategori tanpa deploy ulang, migrasikan ke koleksi Firestore `categories` (lihat Roadmap §23).

### 8.6 TypeScript Interfaces

```ts
// types/app.d.ts
export interface AppDoc {
  appId: string;
  ownerId: string;
  ownerName: string;
  ownerPhotoURL: string | null;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  tags: string[];
  searchKeywords: string[];
  logoURL: string;
  screenshots: string[];
  apkURL: string;
  apkFileName: string;
  apkSizeBytes: number;
  version: string;
  versionCode: number;
  minAndroidVersion: string;
  changelog: string;
  websiteURL: string | null;
  githubURL: string | null;
  downloadCount: number;
  viewCount: number;
  status: "published" | "draft" | "suspended";
  createdAt: FirebaseFirestoreTimestamp;
  updatedAt: FirebaseFirestoreTimestamp;
  lastVersionUpdateAt: FirebaseFirestoreTimestamp;
}

// types/user.d.ts
export interface UserDoc {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  provider: "password" | "google.com";
  bio: string | null;
  website: string | null;
  githubUsername: string | null;
  appCount: number;
  totalDownloads: number;
  status: "active" | "suspended";
  role: "user" | "admin";
  createdAt: FirebaseFirestoreTimestamp;
  updatedAt: FirebaseFirestoreTimestamp;
}
```

### 8.7 Diagram Relasi Data

```mermaid
erDiagram
    USERS ||--o{ APPS : "memiliki (ownerId)"
    APPS ||--o{ VERSIONS : "riwayat versi"
    APPS ||--o{ DOWNLOADS : "dicatat saat diunduh"
    USERS ||--o{ DOWNLOADS : "melakukan unduhan"

    USERS {
        string uid PK
        string displayName
        string email
        number appCount
        number totalDownloads
    }
    APPS {
        string appId PK
        string ownerId FK
        string name
        string slug
        string category
        number downloadCount
        string status
    }
    DOWNLOADS {
        string downloadId PK
        string appId FK
        string userId FK
        string ownerId FK
        timestamp downloadedAt
    }
```

---

## 9. Struktur Firebase Storage

```
users/
└─ {uid}/
   ├─ logos/
   │  └─ {appId}.webp                       (maks 2 MB, image/*)
   ├─ screenshots/
   │  └─ {appId}/
   │     ├─ 1.webp
   │     ├─ 2.webp
   │     └─ ...                             (maks 5 MB per file, image/*)
   └─ apks/
      └─ {appId}/
         └─ {versionCode}-{fileName}.apk    (maks 200 MB, application/vnd.android.package-archive)
```

**Konvensi penamaan:**
- Nama file di-*sanitize* (lowercase, strip spasi → dash) dan diberi suffix `versionCode` agar file lama tidak tertimpa saat update versi — memungkinkan riwayat versi tetap dapat diakses (mendukung fitur `versions` subcollection di roadmap).
- Logo & screenshot dikompres ke format **WebP** di client (menggunakan `browser-image-compression` atau Canvas API) sebelum upload untuk menghemat storage & mempercepat load.

> Folder `public/` Next.js **tidak digunakan** untuk file dinamis — hanya untuk aset statis bawaan (favicon, ilustrasi landing page) yang di-bundle saat build. Ini penting karena `public/` bersifat read-only di lingkungan serverless seperti Vercel; upload runtime harus ke object storage eksternal (Firebase Storage).

---

## 10. Firestore Security Rules

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    function isAppOwner() {
      return isSignedIn() && resource.data.ownerId == request.auth.uid;
    }

    // Field yang boleh berubah oleh siapapun yang sign-in (counter view/download)
    function onlyCounterFieldsChanged() {
      let affected = request.resource.data.diff(resource.data).affectedKeys();
      return affected.hasOnly(['downloadCount', 'viewCount', 'updatedAt']);
    }

    match /users/{userId} {
      allow read: if true;                         // profil publik (nama, avatar) untuk App Card
      allow create: if isOwner(userId)
                    && request.resource.data.uid == userId;
      allow update: if isOwner(userId)
                    && request.resource.data.uid == userId;
      allow delete: if false;                       // penghapusan akun via flow terpisah (roadmap)
    }

    match /apps/{appId} {
      allow read: if resource.data.status == 'published'
                  || (isSignedIn() && isAppOwner());

      allow create: if isSignedIn()
                    && request.resource.data.ownerId == request.auth.uid
                    && request.resource.data.status in ['published', 'draft'];

      allow update: if isAppOwner()
                    || (isSignedIn() && onlyCounterFieldsChanged());

      allow delete: if isAppOwner();

      match /versions/{versionId} {
        allow read: if get(/databases/$(database)/documents/apps/$(appId)).data.status == 'published'
                    || (isSignedIn() && get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid);
        allow write: if isSignedIn()
                     && get(/databases/$(database)/documents/apps/$(appId)).data.ownerId == request.auth.uid;
      }
    }

    match /downloads/{downloadId} {
      allow read: if isSignedIn()
                  && (resource.data.userId == request.auth.uid || resource.data.ownerId == request.auth.uid);
      allow create: if isSignedIn()
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;                // log bersifat append-only
    }
  }
}
```

---

## 11. Firebase Storage Security Rules

```js
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    match /users/{userId}/logos/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /users/{userId}/screenshots/{appId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    match /users/{userId}/apks/{appId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 200 * 1024 * 1024
                   && request.resource.contentType == 'application/vnd.android.package-archive';
    }
  }
}
```

---

## 12. Rincian Halaman & Fitur

### 12.1 Landing Page (`/`) — Adaptif Guest/User

**Elemen bersama:**
- Hero section: tagline *"One Place for Every App"*, search bar besar, statistik (`Total Apps`, `Total Downloads`, `Total Contributors` — hasil agregasi Firestore atau nilai ter-cache).
- Grid kategori (ikon + label, link ke `/category/[slug]`).
- Section "Aplikasi Populer" (`orderBy downloadCount desc`, limit 8).
- Section "Baru Diunggah" (`orderBy createdAt desc`, limit 8).
- Section keuntungan Mobix (poin fitur: gratis, tanpa iklan mengganggu, komunitas terbuka, dsb).

**Perbedaan Guest vs User:**

| Elemen | Guest | User |
|---|---|---|
| Navbar kanan | Tombol **Login** & **Register** | Avatar + dropdown (Dashboard, My Applications, Profile, Settings, Logout) |
| Tombol Download di App Card | Membuka `AuthDialog` (modal ajakan login) | Langsung memicu proses download (§14) |
| Tombol "Upload App" di Navbar | Mengarah ke `/login?redirect=/dashboard/upload` | Mengarah langsung ke `/dashboard/upload` |

### 12.2 Login (`/login`) & Register (`/register`)

- Form: email, password (Login) / email, password, confirm password, display name (Register).
- Tombol "Lanjutkan dengan Google" (`signInWithPopup`).
- Validasi Zod: email format, password minimal 8 karakter, konfirmasi password cocok.
- Redirect otomatis ke halaman asal (`?redirect=`) setelah sukses, atau ke `/` jika tidak ada.
- Jika user sudah login tapi mengakses `/login` atau `/register` secara manual → redirect otomatis ke `/`.

### 12.3 Detail Aplikasi (`/apps/[slug]`)

- **Rendering:** Server Component dengan `generateStaticParams` + ISR (`export const revalidate = 300`), mengambil data via `adminDb` (server-side) agar bisa menghasilkan `generateMetadata` untuk SEO (title, description, Open Graph image = logo aplikasi).
- Bagian interaktif (tombol Download, viewCount increment) dipisah sebagai Client Component kecil (`<DownloadButton appId={appId} />`) yang di-*hydrate* di dalam halaman server-rendered — pola **Server Component shell + Client Component island**.
- Konten: logo besar, nama, kategori, badge versi, ukuran file, jumlah download, tanggal upload/update terakhir, deskripsi panjang, galeri screenshot (lightbox), changelog versi aktif, link website/GitHub jika ada, info pembuat (avatar + nama + link ke daftar aplikasi lain miliknya).
- Jika `status !== 'published'` dan pengunjung bukan pemilik → tampilkan halaman 404.

### 12.4 Dashboard (`/dashboard`)

- Kartu statistik: Total Aplikasi, Total Download (seluruh aplikasi), Aplikasi Terpopuler, Upload Terbaru.
- Grafik ringan (opsional, `recharts`) tren download 7/30 hari terakhir berdasarkan agregasi koleksi `downloads`.
- Shortcut ke "Upload Aplikasi Baru" dan "Kelola Aplikasi".

### 12.5 My Applications (`/dashboard/apps`)

- Tabel/list seluruh aplikasi milik user (`where('ownerId','==',uid)`), dengan status badge (Published/Draft/Suspended), jumlah download per aplikasi, aksi Edit & Hapus.
- Konfirmasi modal sebelum hapus (menampilkan peringatan bahwa file di Storage juga akan dihapus).
- Pagination via cursor Firestore (`startAfter`) jika aplikasi > 10.

### 12.6 Upload App (`/dashboard/upload`)

Field form:

| Field | Wajib | Validasi |
|---|---|---|
| Nama aplikasi | ✅ | 3–60 karakter |
| Deskripsi singkat | ✅ | maks 150 karakter |
| Deskripsi lengkap | ✅ | 20–5000 karakter |
| Kategori | ✅ | salah satu dari `CATEGORIES` |
| Versi | ✅ | format semver sederhana `x.y.z` |
| Logo | ✅ | image, maks 2 MB, rasio disarankan 1:1 |
| File APK | ✅ | `.apk`, maks 200 MB |
| Screenshot | ❌ | maks 6 gambar, masing-masing 5 MB |
| Website resmi | ❌ | URL valid |
| Repository GitHub | ❌ | URL valid, domain github.com |
| Changelog | ❌ | teks bebas |
| Minimum Android Version | ❌ | dropdown preset (Android 6–14) |
| Tag pencarian | ❌ | maks 10 tag, dipisah koma |

Detail alur lihat §13.

### 12.7 Edit App (`/dashboard/apps/[appId]/edit`)

- Form sama seperti Upload, pre-filled dari data existing.
- Jika user mengganti file APK → `versionCode` otomatis increment, file lama dipindah/diarsipkan ke `versions` subcollection (opsional), `lastVersionUpdateAt` diperbarui.
- Guard tambahan: jika `appId` bukan milik user yang login (dicek dari `ownerId` dokumen), tampilkan halaman 403/redirect — sebagai lapisan kedua selain Security Rules.

### 12.8 Profile (`/profile`) & Settings (`/settings`)

- **Profile:** tampilkan & edit `displayName`, `bio`, `website`, `githubUsername`, avatar (upload ke `users/{uid}/avatar.webp`).
- **Settings:** ubah password (reauthenticate dulu via `reauthenticateWithCredential`), hapus akun (soft-delete: set `status: 'suspended'`, atau hard-delete dengan konfirmasi berlapis — lihat Roadmap).

### 12.9 Empty State & Error State

- Empty state konsisten: ilustrasi ringan + pesan kontekstual, misal "Belum ada aplikasi di kategori ini" dengan CTA "Jadi yang pertama upload!".
- Error state: pesan ramah + tombol "Coba Lagi" yang me-retry query terakhir.

---

## 13. Alur Upload Aplikasi

```mermaid
sequenceDiagram
    participant U as User
    participant F as Form (Client)
    participant S as Firebase Storage
    participant D as Firestore

    U->>F: Isi form & pilih file (logo, APK, screenshot)
    F->>F: Validasi Zod (client-side, realtime per field)
    U->>F: Klik Submit
    F->>F: Disable tombol submit, tampilkan progress bar
    F->>S: Upload logo → users/{uid}/logos/{appId}.webp
    S-->>F: logoURL
    F->>S: Upload screenshots (paralel) → users/{uid}/screenshots/{appId}/n.webp
    S-->>F: screenshots[]
    F->>S: Upload APK → users/{uid}/apks/{appId}/{versionCode}-file.apk (dengan progress %)
    S-->>F: apkURL, apkSizeBytes
    F->>D: setDoc(apps/{appId}, {...semua field, ownerId: uid, status:'published'})
    F->>D: increment users/{uid}.appCount +1
    D-->>F: sukses
    F->>U: Toast hijau "Application uploaded successfully" + redirect ke Dashboard
```

**Poin implementasi penting:**
1. `appId` di-generate di client (`doc(collection(db,'apps')).id` atau `nanoid()`) **sebelum** upload file, agar path Storage bisa langsung memakai `appId` yang final.
2. Upload logo & screenshot dikompres terlebih dahulu (`browser-image-compression`) sebelum dikirim ke Storage.
3. Progress upload APK menggunakan `uploadBytesResumable` dari Firebase Storage SDK, yang mengekspos event `state_changed` untuk progress bar realtime.
4. Jika salah satu langkah upload gagal di tengah jalan, file yang sudah terlanjur ter-upload dihapus kembali (`deleteObject`) sebelum menampilkan error — mencegah *orphan file* di Storage.
5. `slug` dibuat dari `slugify(name) + '-' + nanoid(6)` untuk menjamin keunikan tanpa perlu query cek duplikat terlebih dahulu.

---

## 14. Alur Download Aplikasi

```mermaid
sequenceDiagram
    participant U as User/Guest
    participant B as Browser
    participant A as Firebase Auth
    participant D as Firestore
    participant S as Firebase Storage

    U->>B: Klik tombol Download
    B->>A: Cek status login (useAuth)
    alt Belum login
        A-->>B: user = null
        B-->>U: Tampilkan AuthDialog ("Login untuk melanjutkan")
    else Sudah login
        A-->>B: user = {uid}
        B->>D: addDoc(downloads, {appId, userId, ownerId, appVersion, downloadedAt})
        B->>D: updateDoc(apps/{appId}, {downloadCount: increment(1)})
        B->>D: updateDoc(users/{ownerId}, {totalDownloads: increment(1)})
        D-->>B: sukses
        B->>S: Redirect/window.open(apkURL)
        S-->>U: File APK mulai terunduh
    end
```

**Catatan:** pencatatan ke Firestore dan redirect ke `apkURL` dijalankan **paralel/optimistic** (tidak saling menunggu secara blocking) agar pengguna tidak merasakan jeda — jika pencatatan statistik gagal karena jaringan, proses download tetap dilanjutkan dan error di-log secara silent (tidak mengganggu UX inti).

---

## 15. State Management & Data Fetching

| Kebutuhan | Solusi | Alasan |
|---|---|---|
| Status login global | `AuthProvider` (React Context) | Dibutuhkan di hampir seluruh komponen (Navbar, Guard, tombol aksi) |
| Data katalog aplikasi (list, detail) | **SWR** dengan fetcher custom yang membungkus `getDocs`/`getDoc` | Caching otomatis, revalidate on focus, mengurangi read Firestore berulang |
| Data realtime opsional (mis. counter download di Dashboard) | `onSnapshot` dibungkus custom hook `useRealtimeDoc` | Update UI instan tanpa refresh manual |
| State UI lintas komponen (filter kategori aktif, drawer mobile terbuka) | **Zustand** store ringan (`useUIStore`) | Menghindari prop-drilling tanpa overhead Context tambahan |
| Form state | React Hook Form + Zod resolver | Validasi realtime per-field, terintegrasi baik dengan komponen upload multi-step |

Contoh custom hook data fetching:

```ts
// lib/hooks/useApps.ts
import useSWR from "swr";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { AppDoc } from "@/types/app";

async function fetchPopularApps(): Promise<AppDoc[]> {
  const q = query(
    collection(db, "apps"),
    where("status", "==", "published"),
    orderBy("downloadCount", "desc"),
    limit(8)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as AppDoc);
}

export function usePopularApps() {
  return useSWR("apps:popular", fetchPopularApps, { revalidateOnFocus: false });
}
```

---

## 16. Komponen Reusable

| Komponen | Fungsi |
|---|---|
| `Navbar` | Logo, search bar, menu kategori, tombol Upload, area auth (Login/Register vs Profile dropdown) |
| `MobileDrawer` | Menu hamburger untuk viewport mobile |
| `Footer` | Link about, kontak, statistik ringkas |
| `SearchBar` | Input dengan debounce, dropdown saran realtime |
| `AppCard` | Kartu aplikasi (logo, nama, kategori, jumlah download) untuk grid katalog |
| `AppGrid` | Wrapper grid responsif + infinite scroll/pagination |
| `AppDetailHeader` | Header halaman detail (logo besar, nama, badge versi, tombol download) |
| `ScreenshotGallery` | Galeri gambar dengan lightbox |
| `UploadForm` | Form multi-section (info dasar, file, info tambahan) |
| `FileDropzone` | Drag-and-drop area untuk logo/screenshot/APK dengan preview |
| `UploadProgress` | Progress bar per file + estimasi waktu |
| `AuthDialog` | Modal ajakan login saat aksi terkunci ditekan oleh guest |
| `AuthGuard` | Wrapper proteksi halaman privat (§5.3) |
| `StatsCard` | Kartu angka statistik di Dashboard |
| `AppsTable` | Tabel My Applications dengan aksi Edit/Hapus |
| `Skeleton` | Placeholder loading (varian: card, list, detail) |
| `Toast` | Notifikasi hijau/kuning/merah (via `react-hot-toast` custom style) |
| `Modal` | Modal generik (konfirmasi hapus, dsb) |
| `Pagination` | Kontrol halaman berbasis cursor Firestore |
| `EmptyState` / `ErrorState` | Placeholder saat data kosong/gagal dimuat |
| `CategoryPill` | Chip kategori untuk filter cepat |

---

## 17. Sistem Notifikasi & Loading State

**Toast (posisi kanan atas, auto-dismiss ±4 detik):**

| Warna | Kondisi | Contoh Pesan |
|---|---|---|
| 🟢 Hijau | Aksi sukses | "Application uploaded successfully." |
| 🟡 Kuning | Validasi gagal | "Please fill in the required fields before submitting." |
| 🔴 Merah | Error server/jaringan | "Something went wrong. Please check your connection and try again." |

**Loading state:**
- Skeleton loader untuk seluruh area yang menunggu data Firestore (App Grid, Dashboard stats, App Detail).
- Progress bar dengan persentase untuk proses upload file (logo, screenshot, APK terpisah agar user tahu tahap mana yang sedang berjalan).
- Tombol submit di-disable + label berubah (contoh: "Uploading… 42%") selama proses berlangsung untuk mencegah submit ganda.

---

## 18. Strategi Pencarian (Search)

Firestore **tidak mendukung full-text search native**. Dua tingkat strategi:

**A. MVP — `searchKeywords` array + `array-contains`**
Saat upload/edit, sistem men-generate array token dari nama, tag, dan kategori aplikasi (lowercase, tanpa karakter khusus), lalu disimpan di field `searchKeywords`. Query pencarian memakai `where('searchKeywords', 'array-contains', keyword)` untuk pencocokan kata kunci tunggal.

```ts
// lib/utils/searchKeywords.ts
export function generateSearchKeywords(name: string, tags: string[]): string[] {
  const base = `${name} ${tags.join(" ")}`.toLowerCase();
  const words = base.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);

  // Tambahkan juga prefix substring agar pencocokan "kas" bisa menemukan "kasklik"
  const prefixes = words.flatMap((w) =>
    Array.from({ length: w.length }, (_, i) => w.slice(0, i + 1))
  );

  return Array.from(new Set([...words, ...prefixes]));
}
```

> Keterbatasan: `array-contains` hanya mencocokkan satu nilai per query dan array bisa membesar untuk nama panjang. Cukup memadai untuk skala awal (ratusan–ribuan aplikasi).

**B. Skala Produksi — Search Service Eksternal (Roadmap)**
Ketika katalog membesar, migrasikan ke layanan search khusus seperti **Algolia**, **Typesense**, atau **Meilisearch**, disinkronkan dari Firestore via Cloud Function `onWrite` trigger pada koleksi `apps`. Ini memberi relevance ranking, typo-tolerance, dan faceted filter (kategori + kata kunci sekaligus) yang tidak bisa dicapai Firestore native.

---

## 19. Performa & SEO

- **Hybrid rendering:** halaman publik yang butuh SEO (`/`, `/apps/[slug]`, `/category/[slug]`) memakai Server Component + `adminDb` untuk fetch awal (ISR `revalidate` 5 menit), sedangkan interaksi (tombol Download, status login) tetap Client Component kecil yang di-hydrate di dalamnya — sehingga crawler search engine tetap bisa membaca konten meski data sesungguhnya berasal dari Firebase.
- **`generateMetadata`** per halaman detail aplikasi: title, description dari `shortDescription`, Open Graph image dari `logoURL`.
- **Image optimization:** konfigurasi `next.config.js` agar `next/image` mengizinkan domain Firebase Storage:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
    ],
  },
};
```

- **Pagination/infinite scroll:** memakai Firestore query cursor (`startAfter(lastVisibleDoc)`) — bukan `offset`, karena Firestore tidak efisien untuk offset besar.
- **Code-splitting:** komponen berat (form upload multi-section, chart Dashboard) di-*dynamic import* (`next/dynamic`) agar tidak membebani bundle halaman publik.
- **Lazy load gambar** memakai `next/image` bawaan (`loading="lazy"` default) untuk App Card di grid katalog.

---

## 20. Validasi & Error Handling

```ts
// lib/validations/appSchema.ts
import { z } from "zod";

export const appUploadSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").max(60),
  shortDescription: z.string().max(150, "Maksimal 150 karakter"),
  longDescription: z.string().min(20, "Deskripsi terlalu singkat").max(5000),
  category: z.enum([
    "productivity", "tools", "games", "social", "finance",
    "health", "education", "entertainment", "photography", "other",
  ]),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Format versi harus x.y.z"),
  websiteURL: z.string().url().optional().or(z.literal("")),
  githubURL: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(10).optional(),
  logoFile: z
    .instanceof(File)
    .refine((f) => f.size <= 2 * 1024 * 1024, "Logo maksimal 2MB")
    .refine((f) => f.type.startsWith("image/"), "File harus berupa gambar"),
  apkFile: z
    .instanceof(File)
    .refine((f) => f.size <= 200 * 1024 * 1024, "APK maksimal 200MB")
    .refine((f) => f.name.endsWith(".apk"), "File harus berformat .apk"),
});

export type AppUploadInput = z.infer<typeof appUploadSchema>;
```

**Prinsip error handling:**
- Validasi client (Zod) → mencegah request sia-sia ke Firebase.
- Validasi server (Security Rules) → lapisan pertahanan sesungguhnya, tidak bisa dilewati meski client dimanipulasi.
- Setiap operasi async dibungkus `try/catch`; error Firebase (`error.code`) dipetakan ke pesan ramah pengguna (contoh: `storage/unauthorized` → "Anda tidak memiliki izin mengunggah file ini").

---

## 21. Statistik & Counter (Denormalisasi Data)

Karena tidak ada backend custom, counter (`downloadCount`, `viewCount`, `appCount`, `totalDownloads`) diperbarui langsung dari client menggunakan **atomic increment** Firestore (`increment(1)`), bukan read-modify-write manual, untuk menghindari race condition saat banyak pengguna mengunduh aplikasi yang sama secara bersamaan:

```ts
import { doc, updateDoc, increment } from "firebase/firestore";

await updateDoc(doc(db, "apps", appId), {
  downloadCount: increment(1),
  updatedAt: serverTimestamp(),
});
```

**Keterbatasan yang perlu disadari:** pendekatan client-side increment tetap rentan disalahgunakan (misal script mengunduh berulang untuk menaikkan angka) karena tidak ada validasi bisnis di tengah (seperti rate-limit). Untuk MVP ini dapat diterima; mitigasi lanjutan (Cloud Function counter terpusat + rate limiting per UID) masuk ke Roadmap §23.

---

## 22. Environment Variables & Deployment

**Checklist sebelum deploy ke Vercel:**
1. Set seluruh `NEXT_PUBLIC_FIREBASE_*` di Vercel Project Settings → Environment Variables (untuk 3 environment: Development, Preview, Production).
2. Jika memakai Pendekatan B (§5.3) atau SSR Admin SDK (§19), tambahkan `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` sebagai **server-only** env var (tanpa prefix `NEXT_PUBLIC_`).
3. Daftarkan domain produksi (`mobix.vercel.app` / custom domain) di **Firebase Console → Authentication → Settings → Authorized Domains**.
4. Deploy Firestore & Storage Rules via Firebase CLI sebelum go-live:
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```
5. Aktifkan **App Check** (opsional, roadmap) untuk mencegah akses API dari luar aplikasi resmi.

---

## 23. Roadmap Pengembangan Lanjutan

| Fitur | Deskripsi |
|---|---|
| Session cookie + Middleware penuh | Migrasi dari client-guard ke proteksi server-side sesungguhnya (§5.3 Pendekatan B) |
| Rating & Review aplikasi | Sub-koleksi `apps/{appId}/reviews`, rata-rata rating denormalisasi ke dokumen app |
| Riwayat versi lengkap | Aktifkan sub-koleksi `versions` secara penuh dengan halaman "Version History" di detail app |
| Admin panel & moderasi | Role `admin`, kemampuan suspend aplikasi/akun yang melanggar |
| Report/Flag aplikasi | Tombol lapor konten oleh user, masuk antrian moderasi |
| Search service eksternal | Migrasi ke Algolia/Typesense/Meilisearch (§18B) |
| Cloud Functions untuk counter | Pindahkan increment counter ke Cloud Function agar tidak bisa dimanipulasi client, tambahkan rate-limit per UID |
| Kategori dinamis | Pindahkan `CATEGORIES` dari konstanta ke koleksi Firestore, dikelola admin |
| Firebase App Check | Cegah abuse API dari luar aplikasi resmi |
| Push Notification | Notifikasi ke user saat aplikasi yang mereka ikuti/unduh mendapat update versi baru |
| Developer Verified Badge | Badge kepercayaan untuk uploader dengan rekam jejak baik |
| PWA support | Manifest + service worker agar Mobix bisa "diinstall" sebagai app-like experience |
| Dukungan multi-platform | Perluasan dari APK Android ke format lain (IPA, source code, dsb) jika scope produk berkembang |

---

## 24. Checklist Implementasi

**Fase 1 — Fondasi**
- [ ] Setup project Next.js + TypeScript + Tailwind
- [ ] Setup Firebase project & `lib/firebase/client.ts`
- [ ] `AuthProvider` + `useAuth` hook
- [ ] Halaman Login/Register (email & Google)
- [ ] Deploy Firestore & Storage Rules awal

**Fase 2 — Katalog Publik**
- [ ] Landing Page (guest & user variant)
- [ ] Komponen `AppCard`, `AppGrid`, `Navbar`, `Footer`
- [ ] Halaman Detail Aplikasi (SSR/ISR)
- [ ] Halaman kategori & pencarian dasar (`searchKeywords`)

**Fase 3 — Upload & Manajemen**
- [ ] `AuthGuard` untuk route privat
- [ ] Form Upload App + validasi Zod + upload ke Storage
- [ ] Dashboard ringkasan & My Applications
- [ ] Edit & Hapus aplikasi

**Fase 4 — Download & Statistik**
- [ ] Alur download + pencatatan `downloads` + counter atomik
- [ ] Statistik Dashboard (grafik ringan)

**Fase 5 — Polish**
- [ ] Skeleton loading di seluruh halaman
- [ ] Toast notifikasi konsisten (hijau/kuning/merah)
- [ ] Responsive & mobile drawer
- [ ] SEO metadata & Open Graph image

**Fase 6 — Deployment**
- [ ] Environment variables di Vercel
- [ ] Authorized domains Firebase Auth
- [ ] QA lintas device & lintas browser
- [ ] Deploy production

---

*Dokumen ini adalah acuan arsitektur (`rule-mobix.md`). Langkah berikutnya yang disarankan: menyusun `design-mobix.md` yang berisi desain visual (palet warna, tipografi, wireframe tiap halaman) sebelum masuk ke tahap coding.*
