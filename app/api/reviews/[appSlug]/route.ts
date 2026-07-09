import { NextRequest, NextResponse } from "next/server";

// Mock reviews data - di production ini dari database
const mockReviews: Record<string, any[]> = {
  "mysaku": [
    {
      id: "rev1",
      author: "Budi Santoso",
      rating: 5,
      title: "Aplikasi terbaik untuk manage keuangan!",
      content: "Sangat membantu dalam mencatat pengeluaran harian. Interface yang user-friendly dan fitur yang lengkap.",
      createdAt: "2026-07-05T10:30:00.000Z",
      helpful: 24,
    },
    {
      id: "rev2",
      author: "Siti Nurhaliza",
      rating: 4,
      title: "Bagus, tapi butuh beberapa improvement",
      content: "Secara umum sudah bagus. Cuma perlu tambah fitur export ke Excel dan PDF.",
      createdAt: "2026-07-04T15:20:00.000Z",
      helpful: 12,
    },
    {
      id: "rev3",
      author: "Ahmad Wijaya",
      rating: 5,
      title: "Recommended!",
      content: "Pakai untuk keluarga, sangat praktis dan memudahkan pencatatan keuangan keluarga besar.",
      createdAt: "2026-07-02T08:45:00.000Z",
      helpful: 18,
    },
  ],
  "ibu-carelink": [
    {
      id: "rev4",
      author: "Dr. Anita",
      rating: 5,
      title: "Aplikasi yang sangat membantu ibu hamil",
      content: "Fitur tracking kehamilan sangat detail dan informatif. Data medis yang akurat sesuai standar WHO.",
      createdAt: "2026-07-06T12:00:00.000Z",
      helpful: 42,
    },
    {
      id: "rev5",
      author: "Ibu Siti",
      rating: 5,
      title: "Sangat bermanfaat untuk tumbuh kembang anak",
      content: "Fitur tracking pertumbuhan balita sangat membantu. Bisa langsung tahu kalau ada masalah.",
      createdAt: "2026-07-05T14:30:00.000Z",
      helpful: 35,
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appSlug: string }> }
) {
  try {
    const { appSlug } = await params;
    const reviews = mockReviews[appSlug] || [];

    // Calculate rating statistics
    const totalReviews = reviews.length;
    let totalRating = 0;
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      totalRating += review.rating;
      breakdown[review.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    return NextResponse.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      breakdown,
      reviews: reviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", reviews: [], averageRating: 0, totalReviews: 0, breakdown: {} },
      { status: 500 }
    );
  }
}
