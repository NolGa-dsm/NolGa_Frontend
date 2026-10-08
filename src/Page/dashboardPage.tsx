import { useMemo, useState } from 'react'
import SearchBox from '../components/SearchBox'
import WorkList, { workListStyles, type ViewMode } from '../components/WorkList'
import { useWorks } from '../hooks/useWorks'
import { matchesQuery } from '../works'

const ALL = '전체'

function DashboardPage() {
  const works = useWorks()
  const [repo, setRepo] = useState(ALL)
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('list')

  const repos = useMemo(
    () => [...new Set((works ?? []).map((w) => w.repository))],
    [works],
  )

  const visible = useMemo(
    () =>
      (works ?? [])
        .filter((w) => repo === ALL || w.repository === repo)
        .filter((w) => matchesQuery(w, query))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [works, repo, query],
  )

  return (
    <main className="page">
      <style>{workListStyles + styles}</style>
      <div className="page__head">
        <h1 className="page__title">전체 문서</h1>
        <p className="page__subtitle">최근 작업 내용이 자동으로 요약되어 기록됩니다</p>
      </div>

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
        <WorkList works={visible} view={view} />
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
