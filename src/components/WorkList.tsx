import { Link } from 'react-router-dom'
import WorkMenu, { workMenuStyles } from './WorkMenu'
import { STATUS_LABEL, type Work } from '../works'

export type ViewMode = 'list' | 'card'

interface Props {
  works: Work[]
  view: ViewMode
  onDelete?: (id: string) => void | Promise<void> // 지정하면 각 항목에 ⋮ 메뉴(수정/삭제)가 표시됨
}

function WorkList({ works, view, onDelete }: Props) {
  if (works.length === 0) {
    return <p className="works__empty">표시할 작업이 없습니다.</p>
  }
  return (
    <ul className={`works works--${view}`}>
      {works.map((w) => (
        <li key={w.id} className={onDelete ? 'works__item works__item--menu' : 'works__item'}>
          <Link className="work" to={`/works/${w.id}`}>
            <div className="work__main">
              <div className="work__head">
                <h3 className="work__title">{w.title}</h3>
                <span className={`badge badge--${w.status}`}>
                  {STATUS_LABEL[w.status]}
                </span>
              </div>
              <p className="work__summary">{w.summary}</p>
            </div>
            <div className="work__meta">
              <span className="chip">{w.repository}</span>
              <span className="work__author">
                <span className="avatar">{w.author.slice(0, 2).toUpperCase()}</span>
                {w.author}
              </span>
              <time className="work__date">{w.createdAt}</time>
            </div>
          </Link>
          {onDelete && <WorkMenu work={w} onDelete={onDelete} />}
        </li>
      ))}
    </ul>
  )
}

export const workListStyles = workMenuStyles + `
.works { list-style: none; margin: 0; padding: 0; }
.works--card {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}
.works__item { position: relative; }
.works__item:has(.wmenu__btn[aria-expanded='true']) { z-index: 20; }
.works__item--menu .work { padding-right: 56px; }
.works__empty { padding: 64px 0; text-align: center; color: var(--text-faint); }

.work {
  display: flex;
  color: inherit;
  text-decoration: none;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 8px;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.work__main { min-width: 0; flex: 1; }
.work__head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.work__title { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }
.work__summary {
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.work__meta { display: flex; align-items: center; gap: 20px; flex-shrink: 0; font-size: 14px; }
.work__author { display: flex; align-items: center; gap: 8px; min-width: 130px; }
.work__date { color: var(--text-faint); font-variant-numeric: tabular-nums; }

.work:hover { background: var(--surface); }
.works--card .work {
  flex-direction: column;
  align-items: stretch;
  height: 100%;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}
.works--card .work__summary {
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.works--card .work__meta { flex-wrap: wrap; gap: 12px; }
.works--card .work__author { min-width: 0; }
.works--card .work__date { margin-left: auto; }

.chip {
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-muted);
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.avatar {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
}
.badge {
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.badge--auto { color: var(--primary); border-color: rgba(var(--primary-rgb), 0.4); background: rgba(var(--primary-rgb), 0.1); }
.badge--review { color: var(--text-muted); }
.badge--edited { color: #f0b429; border-color: rgba(240, 180, 41, 0.4); background: rgba(240, 180, 41, 0.1); }

@media (max-width: 860px) {
  .work { flex-direction: column; align-items: stretch; gap: 12px; }
  .work__summary { white-space: normal; }
  .work__meta { flex-wrap: wrap; gap: 12px; }
  .work__author { min-width: 0; }
}
`

export default WorkList
