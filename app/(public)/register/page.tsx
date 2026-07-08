"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { registerSchema, type RegisterInput } from "@/lib/validations/appSchema";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<RegisterInput>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setRedirecting(true);
      router.replace("/");
    }
  }, [user, router]);

  if (redirecting) return null;

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        displayName: form.displayName,
        email: form.email,
        photoURL: null,
        provider: "password",
        bio: null,
        website: null,
        githubUsername: null,
        appCount: 0,
        totalDownloads: 0,
        status: "active",
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Registrasi berhasil!");
      router.push("/");
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (firebaseErr.code === "auth/email-already-in-use") {
        toast.error("Email sudah terdaftar");
      } else if (firebaseErr.code === "auth/weak-password") {
        toast.error("Password terlalu lemah");
      } else {
        toast.error("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          displayName: result.user.displayName || "User",
          email: result.user.email,
          photoURL: result.user.photoURL,
          provider: "google.com",
          bio: null,
          website: null,
          githubUsername: null,
          appCount: 0,
          totalDownloads: 0,
          status: "active",
          role: "user",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      toast.success("Registrasi berhasil!");
      router.push("/");
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error("Google register error:", e);
      if (e.code === "auth/popup-blocked") {
        toast.error("Popup diblokir browser. Izinkan popup untuk situs ini.");
      } else if (e.code === "auth/unauthorized-domain") {
        toast.error("Domain tidak terdaftar. Tambahkan domain ini di Firebase Console.");
      } else if (e.code === "auth/cancelled-popup-request") {
        // User cancelled
      } else {
        toast.error(`Gagal registrasi dengan Google: ${e.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun</h1>
          <p className="mt-2 text-sm text-gray-500">Daftar untuk mulai upload dan download aplikasi</p>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              id="displayName"
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Nama Anda"
            />
            {errors.displayName && <p className="mt-1 text-xs text-red-500">{errors.displayName}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="nama@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Ulangi password"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        <button
          onClick={handleGoogleRegister}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Lanjutkan dengan Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
