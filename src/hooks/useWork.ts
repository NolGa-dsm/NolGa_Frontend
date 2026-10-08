import { useCallback, useEffect, useState } from 'react'
import { fetchWork, updateWorkSummary, type WorkDetail } from '../works'

// work - undefined: 로딩 중, null: 존재하지 않는 작업
export function useWork(id: string | undefined) {
  const [state, setState] = useState<{ id?: string; work: WorkDetail | null }>()

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    fetchWork(id, controller.signal)
      .then((work) => setState({ id, work }))
      .catch(() => {})
    return () => controller.abort()
  }, [id])

  const saveSummary = useCallback(
    async (summary: string) => {
      if (!id) return
      await updateWorkSummary(id, summary)
      setState((prev) =>
        prev?.work && prev.id === id
          ? { id, work: { ...prev.work, summary, status: 'edited' } }
          : prev,
      )
    },
    [id],
  )

  const work = !id ? null : state?.id === id ? state.work : undefined
  return { work, saveSummary }
}
