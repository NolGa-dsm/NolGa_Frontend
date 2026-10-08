import { useEffect, useState } from 'react'
import { fetchWorks, type Work } from '../works'

export function useWorks() {
  const [works, setWorks] = useState<Work[] | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchWorks(controller.signal)
      .then(setWorks)
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return works
}
