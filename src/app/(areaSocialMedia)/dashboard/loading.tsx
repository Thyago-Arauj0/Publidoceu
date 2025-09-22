export default function Loading() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Novo Cliente Button Skeleton */}
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>

            {/* Logout Button Skeleton */}
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-6 min-h-screen">
        <div className="mb-6">
          {/* Title Skeleton */}
          <div className="h-8 w-80 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-2"></div>
          {/* Subtitle Skeleton */}
          <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        <hr className="mb-10" />

        {/* Cards Grid Skeleton */}
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

      {/* Footer Skeleton */}
      <div className="h-16 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
