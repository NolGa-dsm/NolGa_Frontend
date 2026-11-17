import AccountSection from '../components/settings/AccountSection'
import AppearanceSection from '../components/settings/AppearanceSection'
import IlgamSection from '../components/settings/IlgamSection'
import McpSection from '../components/settings/McpSection'
import NotificationSection from '../components/settings/NotificationSection'
import RepositorySection from '../components/settings/RepositorySection'
import { pageStyles } from './dashboardPage'

function SettingsPage() {
  return (
    <main className="page page--narrow">
      <style>{styles}</style>
      <div className="page__head">
        <h1 className="page__title">설정</h1>
        <p className="page__subtitle">저장소, 연동, 계정, 알림, 화면을 관리합니다</p>
      </div>
      <div className="settings">
        <RepositorySection />
        <IlgamSection />
        <McpSection />
        <AccountSection />
        <NotificationSection />
        <AppearanceSection />
      </div>
    </main>
  )
}

const styles = pageStyles + `
.page--narrow { max-width: 856px; }
.settings { display: flex; flex-direction: column; gap: 20px; }
.card { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; }
.card__title { display: flex; align-items: center; gap: 10px; margin: 0 0 6px; font-size: 18px; font-weight: 600; }
.card__desc { margin: 0 0 20px; color: var(--text-muted); font-size: 14px; }
.row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
.row:first-of-type { margin-top: 0; }
.stack { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: var(--text-muted); }
.input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
}
.input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--focus-ring); }
.btn {
  padding: 9px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text);
  font-size: 14px;
  cursor: pointer;
}
.btn:hover:not(:disabled) { background: var(--surface-2); }
.btn:disabled { opacity: 0.6; cursor: default; }
.btn--primary { background: var(--primary); border-color: var(--primary); color: var(--primary-ink); font-weight: 600; }
.btn--primary:hover:not(:disabled) { background: var(--primary-hover); }
.btn:focus-visible, .switch:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.list { list-style: none; margin: 16px 0 0; padding: 0; }
.list__item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--border); font-size: 14px; }
.list__item:first-child { border-top: 0; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.muted { color: var(--text-faint); font-size: 13px; }
.msg { margin: 12px 0 0; font-size: 13px; }
.msg--error { color: var(--error); }
.msg--ok { color: var(--success); }
.badge { padding: 2px 8px; border-radius: 999px; background: var(--surface-2); color: var(--text-muted); font-size: 12px; font-weight: 500; }
.badge--ok { background: rgba(var(--success-rgb), 0.14); color: var(--success); }
.badge--err { background: rgba(var(--error-rgb), 0.14); color: var(--error); }
.dot { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; }
.dot--ok { background: var(--success); }
.dot--err { background: var(--error); }
.switch {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border: 0;
  border-radius: 999px;
  background: var(--border);
  cursor: pointer;
  transition: background 0.15s;
}
.switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: var(--text); transition: transform 0.15s; }
.switch[aria-checked='true'] { background: var(--primary); }
.switch[aria-checked='true']::after { transform: translateX(18px); }
`

export default SettingsPage
