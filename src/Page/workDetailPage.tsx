import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useWork } from '../hooks/useWork'
import { SOURCE_LABEL, STATUS_LABEL, type ChangedFile, type SourceType, type WorkSource } from '../works'
import { workListStyles } from '../components/WorkList'
import { pageStyles } from './dashboardPage'

const CHANGE_LABEL: Record<ChangedFile['type'], string> = {
  added: '추가',
  modified: '수정',
  deleted: '삭제',
}

const SOURCE_ORDER: SourceType[] = ['commit', 'issue', 'file', 'note']

function WorkDetailPage() {
  const { id } = useParams()
  const { work, saveSummary } = useWork(id)
  const [searchParams] = useSearchParams()
  const [localDraft, setLocalDraft] = useState<string | null>(null)
  const [editRequested, setEditRequested] = useState(searchParams.has('edit')) // 목록의 ⋮ 메뉴에서 진입
  const draft = localDraft ?? (editRequested && work ? work.summary : null)
  const setDraft = (value: string | null) => {
    setLocalDraft(value)
    setEditRequested(false)
  }

  const sourcesByType = (sources: WorkSource[]) =>
    SOURCE_ORDER.map((type) => ({ type, items: sources.filter((x) => x.type === type) })).filter(
      (g) => g.items.length > 0,
    )

  const submit = async () => {
    if (draft === null || !draft.trim()) return
    await saveSummary(draft.trim())
    setDraft(null)
  }

  return (
    <main className="page">
      <style>{workListStyles + pageStyles + styles}</style>
      <Link to="/dashboard" className="back">← 전체 문서</Link>

      {work === undefined ? (
        <p className="works__empty">불러오는 중...</p>
      ) : work === null ? (
        <p className="works__empty">작업을 찾을 수 없습니다.</p>
      ) : (
        <>
          <div className="detail__head">
            <h1 className="page__title">{work.title}</h1>
            <span className={`badge badge--${work.status}`}>{STATUS_LABEL[work.status]}</span>
          </div>
          <div className="detail__meta work__meta">
            <span className="chip">{work.repository}</span>
            {work.branch && <span className="chip">⎇ {work.branch}</span>}
            <span className="work__author">
              <span className="avatar">{work.author.slice(0, 2).toUpperCase()}</span>
              {work.author}
            </span>
            <time className="work__date">{work.createdAt}</time>
          </div>

          {work.request && (
            <blockquote className="detail__request">
              <span className="detail__label">요청 내용</span>
              {work.request}
            </blockquote>
          )}

          <section className="detail__section">
            <div className="detail__sectionhead">
              <h2>요약</h2>
              {draft === null && (
                <button type="button" className="detail__btn" onClick={() => setDraft(work.summary)}>
                  수정
                </button>
              )}
            </div>
            {draft === null ? (
              <p className="detail__text">{work.summary}</p>
            ) : (
              <>
                <textarea
                  className="detail__editor"
                  value={draft}
                  rows={5}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="요약 수정"
                />
                <div className="detail__actions">
                  <button type="button" className="detail__btn" onClick={() => setDraft(null)}>
                    취소
                  </button>
                  <button
                    type="button"
                    className="detail__btn detail__btn--primary"
                    disabled={!draft.trim()}
                    onClick={submit}
                  >
                    저장
                  </button>
                </div>
              </>
            )}
            {work.styleName && (
              <p className="detail__hint">적용된 문서 스타일: {work.styleName}</p>
            )}
          </section>

          <section className="detail__section">
            <h2>변경사항</h2>
            {work.changes.length === 0 ? (
              <p className="detail__empty">변경사항이 없습니다.</p>
            ) : (
              <ul className="changes">
                {work.changes.map((c) => (
                  <li key={c.path} className="change">
                    <span className={`change__type change__type--${c.type}`}>
                      {CHANGE_LABEL[c.type]}
                    </span>
                    <code className="change__path">{c.path}</code>
                    <span className="change__add">+{c.additions}</span>
                    <span className="change__del">-{c.deletions}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="detail__section">
            <h2>사용된 자료</h2>
            {work.sources.length === 0 ? (
              <p className="detail__empty">사용된 자료가 없습니다.</p>
            ) : (
              sourcesByType(work.sources).map((g) => (
                <div key={g.type} className="sources">
                  <h3 className="sources__title">{SOURCE_LABEL[g.type]}</h3>
                  <ul className="issues">
                    {g.items.map((x) => (
                      <li key={x.id} className="issue">
                        {x.url ? (
                          <a href={x.url} target="_blank" rel="noreferrer">{x.title}</a>
                        ) : (
                          <span>{x.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </main>
  )
}

const styles = `
.back { display: inline-block; margin-bottom: 24px; color: var(--text-muted); font-size: 14px; text-decoration: none; }
.back:hover { color: var(--text); }
.detail__head { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.detail__head .page__title { margin: 0; }
.detail__meta { margin-bottom: 40px; }
.detail__section { margin-bottom: 40px; }
.detail__section h2 { margin: 0 0 16px; font-size: 18px; font-weight: 600; letter-spacing: -0.01em; }
.detail__text { margin: 0; color: var(--text-muted); font-size: 15px; line-height: 1.7; }
.detail__empty { margin: 0; color: var(--text-faint); font-size: 14px; }
.changes, .issues { list-style: none; margin: 0; padding: 0; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.change, .issue { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
.change:last-child, .issue:last-child { border-bottom: 0; }
.change__path { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.change__type { padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border); font-size: 12px; }
.change__type--added { color: #3ecf8e; border-color: rgba(62, 207, 142, 0.4); background: rgba(62, 207, 142, 0.1); }
.change__type--modified { color: #f0b429; border-color: rgba(240, 180, 41, 0.4); background: rgba(240, 180, 41, 0.1); }
.change__type--deleted { color: var(--error); border-color: rgba(255, 107, 107, 0.4); background: rgba(255, 107, 107, 0.1); }
.change__add { color: #3ecf8e; font-variant-numeric: tabular-nums; }
.change__del { color: var(--error); font-variant-numeric: tabular-nums; }
.detail__request { margin: 0 0 40px; padding: 16px 20px; border-left: 3px solid var(--primary); background: var(--surface); border-radius: 0 10px 10px 0; color: var(--text); font-size: 15px; line-height: 1.6; }
.detail__label { display: block; margin-bottom: 6px; color: var(--text-faint); font-size: 12px; }
.detail__sectionhead { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.detail__sectionhead h2 { margin: 0; }
.detail__btn { padding: 6px 12px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: var(--text-muted); font-size: 13px; cursor: pointer; }
.detail__btn:hover { color: var(--text); background: var(--surface-2); }
.detail__btn--primary { color: var(--primary-ink); background: var(--primary); border-color: var(--primary); }
.detail__btn--primary:hover { background: var(--primary-hover); color: var(--primary-ink); }
.detail__btn:disabled { opacity: 0.5; cursor: not-allowed; }
.detail__editor { width: 100%; padding: 14px; border: 1px solid var(--border); border-radius: 10px; background: var(--bg); color: var(--text); font: inherit; font-size: 15px; line-height: 1.7; resize: vertical; }
.detail__editor:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.detail__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.detail__hint { margin: 12px 0 0; color: var(--text-faint); font-size: 13px; }
.sources { margin-bottom: 16px; }
.sources__title { margin: 0 0 8px; color: var(--text-muted); font-size: 13px; font-weight: 500; }
.issue a { color: var(--primary); text-decoration: none; }
.issue a:hover { text-decoration: underline; }
`

export default WorkDetailPage
