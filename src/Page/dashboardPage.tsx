import { useMemo, useState } from 'react'
import SearchBox from '../components/SearchBox'
import WorkList, { workListStyles, type ViewMode } from '../components/WorkList'
import { useWorks } from '../hooks/useWorks'
import { matchesQuery, STATUS_LABEL, type WorkStatus } from '../works'

const ALL = '전체'

function DashboardPage() {
  const { works, remove } = useWorks()
  const [repo, setRepo] = useState(ALL)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('list')
  const [status, setStatus] = useState<WorkStatus | null>(null)

  const repos = useMemo(
    () => [...new Set((works ?? []).map((w) => w.repository))],
    [works],
  )

  const counts = useMemo(() => {
    const c: Record<WorkStatus, number> = { auto: 0, review: 0, edited: 0 }
    for (const w of works ?? []) c[w.status]++
    return c
  }, [works])

  const filtered = repo !== ALL || query.trim() !== '' || status !== null
  const reset = () => {
    setRepo(ALL)
    setQuery('')
    setStatus(null)
  }

  const visible = useMemo(
    () =>
      (works ?? [])
        .filter((w) => repo === ALL || w.repository === repo)
        .filter((w) => status === null || w.status === status)
        .filter((w) => matchesQuery(w, query))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [works, repo, query, status],
  )

  return (
    <main className="page">
      <style>{workListStyles + styles}</style>
      <div className="page__head">
        <h1 className="page__title">전체 문서</h1>
        <p className="page__subtitle">최근 작업 내용이 자동으로 요약되어 기록됩니다</p>
      </div>

      {works !== null && (
        <div className="stats" role="group" aria-label="상태별 문서 수">
          {(['review', 'auto', 'edited'] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={`stat stat--${k}`}
              aria-pressed={status === k}
              onClick={() => setStatus(status === k ? null : k)}
            >
              <span className="stat__count">{counts[k]}</span>
              <span className="stat__label">{STATUS_LABEL[k]}</span>
            </button>
          ))}
        </div>
      )}

      <div className="toolbar">
        <SearchBox value={query} onChange={setQuery} />
        <div className="toolbar__row">
          <div className="filters" role="group" aria-label="프로젝트 필터">
            {[ALL, ...repos].map((r) => (
              <button
                key={r}
                type="button"
                className="filter"
                aria-pressed={repo === r}
                onClick={() => setRepo(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="viewtoggle" role="group" aria-label="보기 방식">
            {(['list', 'card'] as const).map((v) => (
              <button
                key={v}
                type="button"
                className="viewtoggle__btn"
                aria-pressed={view === v}
                onClick={() => setView(v)}
              >
                {v === 'list' ? '리스트' : '카드'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {works === null ? (
        <p className="works__empty">불러오는 중...</p>
      ) : (
        <>
          <p className="works__count" aria-live="polite">
            {filtered ? `조건에 맞는 문서 ${visible.length}건` : `전체 ${visible.length}건`}
            {filtered && (
              <button type="button" className="works__reset" onClick={reset}>
                필터 초기화
              </button>
            )}
          </p>
          <WorkList
            works={visible}
            view={view}
            onDelete={remove}
            emptyMessage={
              filtered
                ? '조건에 맞는 작업이 없습니다. 검색어나 필터를 바꿔 보세요.'
                : '아직 기록된 작업이 없습니다. 작업을 마치면 요약이 자동으로 추가됩니다.'
            }
          />
        </>
      )}
    </main>
  )
}

export const pageStyles = `
.page { max-width: 1200px; margin: 0 auto; padding: 48px clamp(20px, 5vw, 64px) 80px; }
.page__title { margin: 0 0 8px; font-size: 32px; font-weight: 700; letter-spacing: -0.03em; }
.page__subtitle { margin: 0 0 32px; color: var(--text-muted); font-size: 15px; }
`

const styles = pageStyles + `
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px; }
.stat {
  display: flex; align-items: baseline; gap: 10px;
  padding: 16px 18px; min-height: 56px;
  border: 1px solid var(--border); border-radius: 12px;
  background: var(--surface); color: var(--text-muted);
  text-align: left; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.stat:hover { background: var(--surface-2); }
.stat__count { font-size: 26px; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
.stat__label { font-size: 14px; }
.stat--review .stat__count { color: var(--primary); }
.stat[aria-pressed='true'] { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.12); }
.stat:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.works__count { display: flex; align-items: center; gap: 12px; margin: 8px 0 0; color: var(--text-faint); font-size: 13px; }
.works__reset { border: 0; background: none; color: var(--primary); font-size: 13px; cursor: pointer; padding: 4px; }
.works__reset:hover { color: var(--primary-hover); text-decoration: underline; }
@media (max-width: 600px) {
  .stats { gap: 8px; }
  .stat { flex-direction: column; gap: 2px; padding: 12px; }
  .filters { flex-wrap: nowrap; overflow-x: auto; max-width: 100%; padding-bottom: 4px; }
  .filter { white-space: nowrap; min-height: 40px; }
}
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
  border-color: rgba(var(--primary-rgb), 0.5);
  background: rgba(var(--primary-rgb), 0.1);
}
.viewtoggle {
  display: flex;
  padding: 4px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.viewtoggle__btn {
  padding: 7px 14px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
}
.viewtoggle__btn[aria-pressed='true'] { background: var(--surface-2); color: var(--text); }
.filter:focus-visible, .viewtoggle__btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
`

export default DashboardPage
