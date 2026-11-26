import { useCallback, useEffect, useState } from 'react'
import { isAbortError } from '../api'
import { deleteWork, fetchWorks, type Work } from '../works'

export function useWorks() {
  const [works, setWorks] = useState<Work[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchWorks(controller.signal)
      .then(setWorks)
      .catch((err) => {
        if (!isAbortError(err)) setWorks([])
      })
    return () => controller.abort()
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      await deleteWork(id)
    } catch {
      return // 서버에서 삭제하지 못하면 목록에서도 유지한다
    }
    setWorks((prev) => prev && prev.filter((w) => w.id !== id))
  }, [])

  return { works, remove }
}
