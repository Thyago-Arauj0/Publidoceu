export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl min-h-screen">
        {/* Title and Status Card Skeleton */}
        <div className="flex items-start justify-between border-none shadow-none mb-6">
          <div className="space-y-2">
            {/* Title */}
            <div className="h-8 w-80 bg-gray-200 rounded animate-pulse" />

            {/* Status */}
            <div className="flex gap-2 items-center">
              <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Client */}
            <div className="flex items-center space-x-2">
              <div className="h-5 w-14 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Media and Description Card Skeleton */}
          <div className="border-none shadow-none rounded-xl">
            {/* Media */}
            <div className="mb-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-4">
              <div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card Skeleton */}
          <div className="border-none shadow-none rounded-xl">
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Creation Date */}
              <div className="space-y-1">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Last Update */}
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Card Skeleton */}
          <div className="border-none shadow-none rounded-xl">
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-gray-200 pl-4 py-2 bg-white rounded-md">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </footer>
    </div>
  )
}
