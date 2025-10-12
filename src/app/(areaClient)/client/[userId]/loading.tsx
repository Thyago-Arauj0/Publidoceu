export default function Loading() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 min-h-screen">
        {/* Description Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Navigation Controls Skeleton */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ml-2" />
            </div>
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-900 rounded-lg p-6">
              {/* Card Header Skeleton */}
              <div className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse shrink-0" />
                </div>
              </div>

              {/* Card Content Skeleton */}
              <div className="space-y-4 pt-0">
                {/* Image Skeleton */}
                <div className="relative h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />

                {/* Date Skeleton */}
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

                {/* Button Skeleton */}
                <div className="pt-2">
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
