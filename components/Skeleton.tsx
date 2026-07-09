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
      <div className="h-10 w-44 rounded-xl bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        <div className="size-24 sm:size-[100px] shrink-0 rounded-2xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 w-full sm:w-auto space-y-3 text-center sm:text-left">
          <div className="h-6 sm:h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700 mx-auto sm:mx-0" />
          <div className="h-4 w-1/4 rounded bg-gray-200 dark:bg-gray-700 mx-auto sm:mx-0" />
          <div className="flex justify-center sm:justify-start gap-2">
            <div className="h-11 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-around gap-2 border-y border-gray-100 py-4 dark:border-gray-800">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 sm:h-64 w-[120px] sm:w-[140px] shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="rounded-xl border border-gray-100 p-5 dark:border-gray-800">
        <div className="mb-2 h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-4 h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-3 h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="mb-6 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="space-y-1.5 text-center">
          <div className="mx-auto h-10 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mx-auto h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="w-full sm:flex-1 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="h-3 w-5 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 pt-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-gray-100 p-4 dark:border-gray-800">
            <div className="mb-2 flex items-center gap-3">
              <div className="size-8 sm:size-9 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
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
