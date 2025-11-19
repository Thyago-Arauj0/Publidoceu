"use client"

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="text-center">
        {/* Círculo giratório */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        
        {/* Texto */}
        <p className="mt-4 text-gray-600 font-medium">Carregando...</p>
      </div>
    </div>
  )
}