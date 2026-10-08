import { useMemo, useState } from 'react'
import SearchBox from '../components/SearchBox'
import WorkList, { workListStyles } from '../components/WorkList'
import { useMyWorks } from '../hooks/useMyWorks'
import { matchesQuery, STATUS_LABEL, type WorkStatus } from '../works'
import { pageStyles } from './dashboardPage'

type StatusFilter = 'all' | WorkStatus

const STATUSES: StatusFilter[] = ['all', 'auto', 'review', 'edited']

function MyWorksPage() {
  const works = useMyWorks()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: 0, auto: 0, review: 0, edited: 0 }
    for (const w of works ?? []) {
      c.all += 1
      c[w.status] += 1
    }
    return c
  }, [works])

  const visible = useMemo(
    () =>
      (works ?? [])
        .filter((w) => status === 'all' || w.status === status)
        .filter((w) => matchesQuery(w, query))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [works, status, query],
  )

  return (
    <main className="page">
      <style>{workListStyles + pageStyles + styles}</style>
      <div className="page__head">
        <h1 className="page__title">내 작업</h1>
        <p className="page__subtitle">내가 작성한 작업 문서를 한눈에 확인하고 검토합니다</p>
      </div>

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <div className="toolbar__row">
          <div className="filters" role="group" aria-label="상태 필터">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className="filter"
                aria-pressed={status === s}
                onClick={() => setStatus(s)}
              >
                {s === 'all' ? '전체' : STATUS_LABEL[s]} {counts[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {works === null ? (
        <p className="works__empty">불러오는 중...</p>
      ) : (
        <WorkList works={visible} view="list" />
      )}
    </main>
  )
}

const styles = `
.toolbar { display: flex; flex-direction: column; gap: 16px; margin-bottom: 8px; }
.toolbar__row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filter {
  padding: 8px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.filter:hover { color: var(--text); background: var(--surface-2); }
.filter[aria-pressed='true'] {
  color: var(--primary);
  border-color: rgba(79, 140, 255, 0.5);
  background: rgba(79, 140, 255, 0.1);
}
.filter:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
`

export default MyWorksPage
