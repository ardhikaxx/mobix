export const translations = {
  id: {
    // Navbar
    navbar: {
      categories: "Kategori",
      about: "Tentang",
      settings: "Pengaturan",
      login: "Login",
      register: "Daftar",
    },
    // Footer
    footer: {
      home: "Beranda",
      about: "Tentang",
      copyright: "Hak Cipta",
    },
    // Home Page
    home: {
      search: "Cari aplikasi...",
      recommended: "Rekomendasi untuk Anda",
      categories: "Kategori",
      newUpdates: "Pembaruan Terbaru",
      searchResults: "Hasil pencarian untuk",
      clear: "Bersihkan",
      noResults: "Tidak ada hasil",
      sortNewest: "Terbaru",
      sortPopular: "Populer",
      loadMore: "Muat Lainnya",
      filterReset: "✕ Reset",
      download: "download",
      downloads: "Download",
    },
    // Settings Dialog
    settings: {
      title: "Pengaturan",
      theme: "Tema",
      language: "Bahasa",
      about: "Tentang",
      selectTheme: "Pilih tema tampilan aplikasi",
      selectLanguage: "Pilih bahasa aplikasi",
      systemTheme: "Sesuai Device",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      indonesian: "Bahasa Indonesia",
      english: "English",
      version: "v1.0.0",
      description: "Platform distribusi aplikasi mobile berbasis komunitas. Upload dan download aplikasi Android buatan komunitas.",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan",
      contact: "Hubungi Kami",
    },
    // Rating & Review
    rating: {
      title: "Rating & Review",
      reviews: "ulasan",
      writeReview: "Tulis Ulasan",
      customerReviews: "Ulasan Pelanggan",
      noReviews: "Belum ada ulasan. Jadilah yang pertama!",
      helpful: "Membantu",
    },
  },
  en: {
    // Navbar
    navbar: {
      categories: "Categories",
      about: "About",
      settings: "Settings",
      login: "Login",
      register: "Register",
    },
    // Footer
    footer: {
      home: "Home",
      about: "About",
      copyright: "Copyright",
    },
    // Home Page
    home: {
      search: "Search apps...",
      recommended: "Recommended for You",
      categories: "Categories",
      newUpdates: "New Updates",
      searchResults: "Search results for",
      clear: "Clear",
      noResults: "No results found",
      sortNewest: "Newest",
      sortPopular: "Popular",
      loadMore: "Load More",
      filterReset: "✕ Reset",
      download: "download",
      downloads: "Downloads",
    },
    // Settings Dialog
    settings: {
      title: "Settings",
      theme: "Theme",
      language: "Language",
      about: "About",
      selectTheme: "Select app theme",
      selectLanguage: "Select app language",
      systemTheme: "System Default",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      indonesian: "Bahasa Indonesia",
      english: "English",
      version: "v1.0.0",
      description: "Community-based mobile app distribution platform. Upload and download Android apps created by the community.",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      contact: "Contact Us",
    },
    // Rating & Review
    rating: {
      title: "Rating & Review",
      reviews: "reviews",
      writeReview: "Write a Review",
      customerReviews: "Customer Reviews",
      noReviews: "No reviews yet. Be the first to review!",
      helpful: "Helpful",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.id;
