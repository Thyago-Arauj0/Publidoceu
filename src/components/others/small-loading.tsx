// loading.tsx
"use client"

import React from "react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[100px]">
      <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  )
}
