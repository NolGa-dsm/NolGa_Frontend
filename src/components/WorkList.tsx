import { Link } from 'react-router-dom'
import WorkMenu, { workMenuStyles } from './WorkMenu'
import { STATUS_LABEL, type Work } from '../works'

export type ViewMode = 'list' | 'card'

interface Props {
  works: Work[]
  view: ViewMode
  emptyMessage?: string
  onDelete?: (id: string) => void | Promise<void> // 지정하면 각 항목에 ⋮ 메뉴(수정/삭제)가 표시됨
}

function WorkList({ works, view, onDelete, emptyMessage = '표시할 작업이 없습니다.' }: Props) {
  if (works.length === 0) {
    return <p className="works__empty">{emptyMessage}</p>
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
              <div className="work__more">
                <div className="work__more-inner">
                  <p className="work__summary">{w.summary}</p>
                  <div className="work__meta">
                    <span className="chip">{w.repository}</span>
                    <span className="work__author">
                      <span className="avatar">{w.author.slice(0, 2).toUpperCase()}</span>
                      {w.author}
                    </span>
                    <time className="work__date">{w.createdAt}</time>
                  </div>
                </div>
              </div>
            </div>
            <time className="work__date work__date--head" aria-hidden="true">
              {w.createdAt}
            </time>
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 8px;
  border-bottom: 1px solid var(--border);
  transition: background 0.25s ease;
}
.work__main { min-width: 0; flex: 1; }
.work__head { display: flex; align-items: center; gap: 10px; min-height: 26px; }
.work__title { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }

/* 상세 영역: grid 행 높이(0fr ↔ 1fr)로 부드럽게 펼침 */
.work__more { display: grid; grid-template-rows: 1fr; }
.work__more-inner { min-height: 0; overflow: hidden; }
.work__summary {
  margin: 8px 0 0;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.6;
  max-width: 72ch;
}
.work__meta { display: flex; align-items: center; gap: 20px; margin-top: 12px; font-size: 14px; }
.work__author { display: flex; align-items: center; gap: 8px; }
.work__date { margin-left: auto; color: var(--text-faint); font-variant-numeric: tabular-nums; }
.work__date--head { display: none; }

.work:hover { background: var(--surface); }
/* ⋮ 메뉴는 호버로 행이 늘어나도 제목 줄 높이에 고정 */
.works--list .wmenu { top: 13px; margin-top: 0; }

/* 카드 보기 */
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.works--card .work__meta { flex-wrap: wrap; gap: 12px; }

/* 리스트 보기(마우스 환경): 평소엔 제목·상태·날짜만, 호버/포커스 시 천천히 펼침 */
@media (hover: hover) and (min-width: 861px) {
  .works--list .work__more {
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.35s ease, opacity 0.3s ease;
  }
  .works--list .works__item:hover .work__more,
  .works--list .works__item:focus-within .work__more {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  .works--list .work__summary,
  .works--list .work__meta { visibility: hidden; transition: visibility 0.35s; }
  .works--list .works__item:hover .work__summary,
  .works--list .works__item:hover .work__meta,
  .works--list .works__item:focus-within .work__summary,
  .works--list .works__item:focus-within .work__meta { visibility: visible; }
  .works--list .work { padding-bottom: 16px; }
  .works--list .work__date--head {
    display: block;
    line-height: 26px;
    transition: opacity 0.2s ease;
  }
  .works--list .works__item:hover .work__date--head,
  .works--list .works__item:focus-within .work__date--head { opacity: 0; }
}

@media (max-width: 860px) {
  .work { flex-direction: column; align-items: stretch; gap: 12px; }
  .work__meta { flex-wrap: wrap; gap: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .work, .work__more, .work__date--head { transition: none !important; }
}

.chip { display: inline-block; }
.works--list .works__item:hover .work__author,
.works--list .works__item:focus-within .work__author { display: flex; }
.works--list .works__item:hover .work__date,
.works--list .works__item:focus-within .work__date { margin-left: auto; }

/* 호버가 없는 터치 기기에서는 항상 펼쳐서 보여줌 */
@media (hover: none) {
  .works--list .work__summary { display: block; white-space: normal; }
  .works--list .work__meta .chip { display: inline-block; }
  .works--list .work__author { display: flex; }
}

.chip { display: inline-block; }
.works--list .works__item--open .work__author { display: flex; }
.works--list .work { padding-top: 16px; padding-bottom: 16px; }
/* ⋮ 메뉴는 호버로 행이 늘어나도 제목 줄 높이에 고정 */
.works--list .wmenu { top: 13px; margin-top: 0; }
.works--list .works__item--open .work { flex-direction: column; align-items: stretch; gap: 12px; padding-top: 20px; padding-bottom: 22px; }
.works--list .works__item--open .work__date { margin-left: auto; }
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
  background: var(--accent);
  color: var(--accent-ink);
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
.badge--edited { color: var(--warning); border-color: rgba(var(--warning-rgb), 0.4); background: rgba(var(--warning-rgb), 0.12); }

@media (max-width: 860px) {
  .work { flex-direction: column; align-items: stretch; gap: 12px; }
  .work__summary { white-space: normal; }
  .work__meta { flex-wrap: wrap; gap: 12px; }
  .work__author { min-width: 0; }
}
`

export default WorkList
