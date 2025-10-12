export default function Loading() {
  return (
      <main className="container mx-auto mt-10 min-h-screen">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar Skeleton */}
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div>
                      {/* Name Skeleton */}
                      <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-1"></div>
                      {/* Company Skeleton */}
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge Skeleton */}
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    {/* Menu Button Skeleton */}
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="px-6 pb-6 space-y-3">
                {/* Email Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>

                {/* Phone Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>

                {/* Stats Row Skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                </div>

                {/* Action Button Skeleton */}
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
  )
}
