import Link from "next/link";
import { Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="size-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Mobix</span>
            </div>
            <p className="text-sm text-gray-500">
              One Place for Every App. Platform distribusi aplikasi mobile berbasis komunitas.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Navigate</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="transition hover:text-blue-600">Home</Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-blue-600">About</Link>
              </li>
              <li>
                <Link href="/search" className="transition hover:text-blue-600">Search</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Categories</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/category/productivity" className="transition hover:text-blue-600">Productivity</Link>
              </li>
              <li>
                <Link href="/category/games" className="transition hover:text-blue-600">Games</Link>
              </li>
              <li>
                <Link href="/category/tools" className="transition hover:text-blue-600">Tools</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Account</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/login" className="transition hover:text-blue-600">Login</Link>
              </li>
              <li>
                <Link href="/register" className="transition hover:text-blue-600">Register</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Mobix. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
