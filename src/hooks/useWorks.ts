import { useCallback, useEffect, useState } from 'react'
import { deleteWork, fetchWorks, type Work } from '../works'

export function useWorks() {
  const [works, setWorks] = useState<Work[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchWorks(controller.signal)
      .then(setWorks)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteWork(id)
    setWorks((prev) => prev && prev.filter((w) => w.id !== id))
  }, [])

  return { works, remove }
}
