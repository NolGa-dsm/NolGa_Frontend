import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Work } from '../works'

interface Props {
  work: Work
  onDelete: (id: string) => void | Promise<void>
}

function WorkMenu({ work, onDelete }: Props) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  return (
    <div className="wmenu" ref={ref}>
      <button
        type="button"
        className="wmenu__btn"
        aria-label={`${work.title} 메뉴`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {open && (
        <div className="wmenu__list" role="menu">
          <button
            type="button"
            role="menuitem"
            className="wmenu__item"
            onClick={() => navigate(`/works/${work.id}?edit=1`)}
          >
            수정
          </button>
          <button
            type="button"
            role="menuitem"
            className="wmenu__item wmenu__item--danger"
            onClick={() => {
              setOpen(false)
              if (window.confirm(`"${work.title}" 문서를 삭제할까요?`)) onDelete(work.id)
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

export const workMenuStyles = `
.wmenu { position: absolute; top: 50%; right: 8px; margin-top: -16px; }
.works--card .wmenu { top: 12px; right: 10px; margin-top: 0; }
.wmenu__btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.wmenu__btn:hover, .wmenu__btn[aria-expanded='true'] { background: var(--surface-2); color: var(--text); }
.wmenu__btn:focus-visible, .wmenu__item:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.wmenu__list {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 10;
  min-width: 120px;
  padding: 4px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
.wmenu__item {
  display: block;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  text-align: left;
  cursor: pointer;
}
.wmenu__item:hover { background: var(--border); }
.wmenu__item--danger { color: var(--error); }
`

export default WorkMenu
