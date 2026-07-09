"use client";

import { Star } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
}

export function RatingStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeMap[size]} ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function RatingSummary({
  rating,
  totalReviews,
  breakdown,
}: {
  rating: number;
  totalReviews: number;
  breakdown: { [key: number]: number };
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Rating & Review</h3>
      
      <div className="mb-6 flex items-start gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">{rating.toFixed(1)}</div>
          <RatingStars rating={rating} size="lg" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {totalReviews} reviews
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = breakdown[stars] || 0;
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-12 text-sm text-gray-600 dark:text-gray-400">{stars}★</span>
                <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button className="w-full rounded-lg bg-store py-2 text-sm font-medium text-white transition hover:bg-store-light dark:hover:bg-store-light/80">
        Write a Review
      </button>
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Reviews</h3>
      
      {reviews.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{review.author}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <RatingStars rating={review.rating} size="sm" />
              </div>
              
              <h4 className="mb-1 font-medium text-gray-900 dark:text-gray-100">{review.title}</h4>
              <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{review.content}</p>
              
              <button className="text-xs font-medium text-gray-600 transition hover:text-store dark:text-gray-400 dark:hover:text-store">
                Helpful ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
