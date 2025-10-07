import { useState } from "react"

export function useItemLoading() {
  const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set())

  const startLoading = (id: number) =>
    setLoadingIds(prev => new Set(prev).add(id))

  const stopLoading = (id: number) =>
    setLoadingIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })

  const isLoadingItem = (id: number) => loadingIds.has(id)

  return { isLoadingItem, startLoading, stopLoading }
}
