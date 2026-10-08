import { useEffect, useState } from 'react'
import { fetchMyWorks, type Work } from '../works'

export function useMyWorks() {
  const [works, setWorks] = useState<Work[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchMyWorks(controller.signal)
      .then(setWorks)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return works
}
