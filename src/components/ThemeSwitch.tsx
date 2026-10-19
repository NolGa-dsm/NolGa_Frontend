import { useState } from 'react'
import { getTheme, setTheme, type Theme } from '../theme'

function ThemeSwitch() {
  const [theme, setThemeState] = useState<Theme>(getTheme)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setThemeState(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label="다크 모드"
      className="themeswitch"
      onClick={toggle}
    >
      <style>{styles}</style>
      <span className="themeswitch__knob">
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.3a.6.6 0 0 0-.7-.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </g>
          </svg>
        )}
      </span>
    </button>
  )
}

const styles = `
.themeswitch {
  position: relative;
  width: 56px;
  height: 30px;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(232, 185, 63, 0.32);
  cursor: pointer;
  transition: background 0.3s ease;
}
.themeswitch[aria-checked='true'] { background: var(--surface-2); }
.themeswitch__knob {
  position: absolute;
  top: 3px;
  left: 3px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e8b93f;
  color: #fff;
  transition: transform 0.3s ease, background 0.3s ease;
}
.themeswitch[aria-checked='true'] .themeswitch__knob {
  transform: translateX(26px);
  background: var(--primary);
  color: var(--primary-ink);
}
.themeswitch:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .themeswitch, .themeswitch__knob { transition: none; }
}
`

export default ThemeSwitch
