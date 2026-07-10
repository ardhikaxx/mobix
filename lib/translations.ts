export const translations = {
  id: {
    // Navbar
    navbar: {
      categories: "Kategori",
      request: "Request",
      chat: "Komunitas",
      about: "Tentang",
      settings: "Pengaturan",
      login: "Login",
      register: "Daftar",
    },
    // Footer
    footer: {
      home: "Beranda",
      about: "Tentang",
      privacy: "Kebijakan Privasi",
      terms: "Syarat & Ketentuan",
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
      sortRating: "Rating",
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
    // Breadcrumb
    breadcrumb: {
      home: "Beranda",
      category: "Kategori",
      developers: "Developer",
      requests: "Request",
      login: "Login",
      register: "Daftar",
      about: "Tentang",
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
      request: "Request",
      chat: "Community",
      about: "About",
      settings: "Settings",
      login: "Login",
      register: "Register",
    },
    // Footer
    footer: {
      home: "Home",
      about: "About",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
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
      sortRating: "Rating",
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
    // Breadcrumb
    breadcrumb: {
      home: "Home",
      category: "Category",
      developers: "Developers",
      requests: "Requests",
      login: "Login",
      register: "Register",
      about: "About",
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
