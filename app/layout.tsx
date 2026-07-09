import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mobix-mu.vercel.app"),
  title: {
    default: "Mobix — Platform Aplikasi Android Komunitas Terbaik",
    template: "%s | Mobix",
  },
  description:
    "Mobix adalah platform distribusi aplikasi mobile berbasis komunitas. Upload, download, dan share aplikasi Android buatan komunitas Indonesia dengan mudah dan aman.",
  keywords: [
    "aplikasi android",
    "download aplikasi",
    "mobix",
    "aplikasi komunitas",
    "apk android",
    "platform aplikasi",
  ],
  authors: [{ name: "Mobix Team" }],
  creator: "Mobix",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mobix-mu.vercel.app",
    title: "Mobix — Platform Aplikasi Android Komunitas Terbaik",
    description:
      "Platform distribusi aplikasi mobile berbasis komunitas. Upload dan download aplikasi Android buatan komunitas.",
    siteName: "Mobix",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Mobix Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mobix — Platform Aplikasi Android Komunitas",
    description: "Platform distribusi aplikasi mobile berbasis komunitas",
    images: ["/opengraph-image.png"],
    creator: "@mobix_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://mobix-mu.vercel.app",
    languages: {
      id: "https://mobix-mu.vercel.app",
      en: "https://mobix-mu.vercel.app/en",
    },
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#01875f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Mobix",
              description:
                "Platform distribusi aplikasi mobile berbasis komunitas",
              url: "https://mobix-mu.vercel.app",
              applicationCategory: "Utilities",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "IDR",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1000",
              },
            }),
          }}
        />
        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Beranda", item: "https://mobix-mu.vercel.app" },
                { "@type": "ListItem", position: 2, name: "Kategori", item: "https://mobix-mu.vercel.app#categories" },
                { "@type": "ListItem", position: 3, name: "Tentang", item: "https://mobix-mu.vercel.app/about" },
              ],
            }),
          }}
        />
        {/* Additional Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mobix" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png" sizes="180x180" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){try{var t=localStorage.getItem('mobix-theme'),d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})();
            `,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
              success: {
                style: {
                  background: "#059669",
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#dc2626",
                  color: "#fff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
