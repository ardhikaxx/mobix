export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 p-3 sm:p-4 dark:border-gray-800">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="size-14 sm:size-16 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        <div className="size-24 sm:size-[100px] shrink-0 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 w-full sm:w-auto space-y-3 text-center sm:text-left">
          <div className="h-6 sm:h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700 mx-auto sm:mx-0" />
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700 mx-auto sm:mx-0" />
          <div className="flex justify-center sm:justify-start gap-2">
            <div className="h-11 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 p-6 dark:border-gray-800">
      <div className="mb-2 h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}
