import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useWork } from '../hooks/useWork'
import { STATUS_LABEL } from '../works'
import { workListStyles } from '../components/WorkList'
import { pageStyles } from './dashboardPage'

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
              <div className="detail__text detail__md"><ReactMarkdown>{work.summary}</ReactMarkdown></div>
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
.detail__md > :first-child { margin-top: 0; }
.detail__md > :last-child { margin-bottom: 0; }
.detail__md h1, .detail__md h2, .detail__md h3 { margin: 20px 0 8px; color: var(--text); font-size: 16px; font-weight: 600; }
.detail__md ul, .detail__md ol { padding-left: 20px; }
.detail__md code { padding: 2px 6px; border-radius: 4px; background: var(--surface-2); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
.detail__md pre { padding: 12px; border-radius: 8px; background: var(--surface-2); overflow-x: auto; }
.detail__md pre code { padding: 0; background: none; }
.detail__md a { color: var(--primary); }
`

export default WorkDetailPage
