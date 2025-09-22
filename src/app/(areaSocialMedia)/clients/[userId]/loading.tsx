"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [widths, setWidths] = useState<number[]>([])

  useEffect(() => {
    // gera larguras aleatórias só no cliente
    setWidths([1, 2, 3, 4, 5].map(() => 80 + Math.random() * 40))
  }, [])

  return (
    <div className="p-6">
      {/* Status navigation buttons skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i, idx) => (
          <div
            key={i}
            className="h-10 bg-gray-200 rounded animate-pulse"
            style={{ width: widths[idx] ?? 100 }} // fallback até hidratar
          />
        ))}
      </div>

      {/* Cards grid skeleton */}
      <div className="mt-10 grid md:grid-cols-4 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
            {/* Card header with title and menu */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-2" />
            </div>

            {/* Date section */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>

            {/* Status badge and move button */}
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
