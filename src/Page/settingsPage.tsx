import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  changePassword,
  disconnectIlgam,
  fetchIlgam,
  fetchMcpStatus,
  fetchNotifications,
  fetchTrackedRepositories,
  removeRepository,
  saveIlgam,
  saveNotifications,
  type IlgamSettings,
  type McpStatus,
  type NotificationSettings,
  type TrackedRepository,
} from '../settings'
import { pageStyles } from './dashboardPage'

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : '요청 중 오류가 발생했습니다.')

function RepositorySection() {
  const [repos, setRepos] = useState<TrackedRepository[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchTrackedRepositories(controller.signal).then(setRepos).catch(() => {})
    return () => controller.abort()
  }, [])

  const remove = async (id: string) => {
    try {
      await removeRepository(id)
      setRepos((prev) => (prev ?? []).filter((r) => r.id !== id))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="card" aria-labelledby="s-repo">
      <h2 id="s-repo" className="card__title">저장소 연동 상태</h2>
      {error && <p className="msg msg--error" role="alert">{error}</p>}
      {repos === null ? (
        <p className="muted">불러오는 중...</p>
      ) : repos.length === 0 ? (
        <p className="muted">등록된 저장소가 없습니다. MCP에서 저장소를 등록해 주세요.</p>
      ) : (
        <ul className="list">
          {repos.map((r) => (
            <li key={r.id} className="list__item">
              <span className="mono">{r.name}</span>
              <button type="button" className="btn" onClick={() => remove(r.id)}>해제</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function IlgamSection() {
  const [info, setInfo] = useState<IlgamSettings | null>(null)
  const [url, setUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetchIlgam(controller.signal)
      .then((v) => {
        setInfo(v)
        setUrl(v.url)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^https?:\/\//.test(url.trim()) || !apiKey) {
      setMsg({ type: 'error', text: '사이트 주소(http/https)와 API 키를 입력해주세요.' })
      return
    }
    try {
      setInfo(await saveIlgam(url.trim(), apiKey))
      setApiKey('')
      setMsg({ type: 'ok', text: '일감 사이트가 연동되었습니다.' })
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) })
    }
  }

  const disconnect = async () => {
    try {
      await disconnectIlgam()
      setInfo({ url: '', connected: false })
      setUrl('')
      setMsg({ type: 'ok', text: '연동이 해제되었습니다.' })
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) })
    }
  }

  return (
    <section className="card" aria-labelledby="s-ilgam">
      <h2 id="s-ilgam" className="card__title">
        일감 사이트 연동 상태
        <span className={`badge ${info?.connected ? 'badge--ok' : ''}`}>
          {info?.connected ? '연동됨' : '연동 안 됨'}
        </span>
      </h2>
      <p className="card__desc">연동은 MCP에서 진행하며, 웹에서는 연동 정보를 수정하거나 해제합니다.</p>
      {info === null ? (
        <p className="muted">불러오는 중...</p>
      ) : !info.connected ? (
        <p className="muted">연동된 일감 사이트가 없습니다. MCP에서 연동하면 여기에 표시됩니다.</p>
      ) : (
      <form className="stack" onSubmit={save} noValidate>
        <label className="field">
          <span>사이트 주소</span>
          <input className="input" type="url" placeholder="https://ilgam.example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <label className="field">
          <span>API 키</span>
          <input className="input" type="password" autoComplete="off" placeholder="변경하려면 새 키 입력" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </label>
        <div className="row">
          <button type="submit" className="btn btn--primary">수정</button>
          <button type="button" className="btn" onClick={disconnect}>연동 해제</button>
        </div>
      </form>
      )}
      {msg && <p className={`msg msg--${msg.type}`} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}
    </section>
  )
}

function McpSection() {
  const [status, setStatus] = useState<McpStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const recheck = useCallback(async () => {
    setLoading(true)
    try {
      setStatus(await fetchMcpStatus())
    } catch {
      /* failed */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchMcpStatus(controller.signal).then(setStatus).catch(() => {})
    return () => controller.abort()
  }, [])

  return (
    <section className="card" aria-labelledby="s-mcp">
      <h2 id="s-mcp" className="card__title">
        MCP 연결 상태
        {status && (
          <span className={`badge ${status.status === 'connected' ? 'badge--ok' : 'badge--err'}`}>
            {status.status === 'connected' ? '정상' : '연결 끊김'}
          </span>
        )}
      </h2>
      <p className="card__desc">에디터/툴에서 NolGa MCP가 정상적으로 호출되는지 확인합니다.</p>
      {status === null ? (
        <p className="muted">확인 중...</p>
      ) : (
        <ul className="list">
          {status.clients.map((c) => (
            <li key={c.name} className="list__item">
              <span>
                <span className={`dot ${c.status === 'connected' ? 'dot--ok' : 'dot--err'}`} aria-hidden="true" />
                {c.name}
              </span>
              <span className="muted">
                {c.status === 'error' ? '호출 오류' : c.lastCalledAt ? `마지막 호출 ${new Date(c.lastCalledAt).toLocaleString('ko-KR')}` : '호출 기록 없음'}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="row">
        <button type="button" className="btn" disabled={loading} onClick={recheck}>
          {loading ? '확인 중...' : '다시 확인'}
        </button>
        {status && <span className="muted">확인 시각 {new Date(status.checkedAt).toLocaleTimeString('ko-KR')}</span>}
      </div>
    </section>
  )
}

function AccountSection() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!current || !next) return setMsg({ type: 'error', text: '모든 항목을 입력해주세요.' })
    if (next.length < 8) return setMsg({ type: 'error', text: '새 비밀번호는 8자 이상이어야 합니다.' })
    if (next !== confirm) return setMsg({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' })
    setSubmitting(true)
    try {
      await changePassword(current, next)
      setCurrent('')
      setNext('')
      setConfirm('')
      setMsg({ type: 'ok', text: '비밀번호가 변경되었습니다.' })
    } catch (err) {
      setMsg({ type: 'error', text: errorMessage(err) })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card" aria-labelledby="s-account">
      <h2 id="s-account" className="card__title">계정 정보</h2>
      <p className="card__desc">아이디: {localStorage.getItem('username') ?? '-'}</p>
      <form className="stack" onSubmit={submit} noValidate>
        <label className="field">
          <span>현재 비밀번호</span>
          <input className="input" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </label>
        <label className="field">
          <span>새 비밀번호</span>
          <input className="input" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        </label>
        <label className="field">
          <span>새 비밀번호 확인</span>
          <input className="input" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <div className="row">
          <button type="submit" className="btn btn--primary" disabled={submitting}>비밀번호 변경</button>
        </div>
      </form>
      {msg && <p className={`msg msg--${msg.type}`} role={msg.type === 'error' ? 'alert' : 'status'}>{msg.text}</p>}
    </section>
  )
}

const NOTIFICATION_LABELS: Record<keyof NotificationSettings, string> = {
  documentCreated: '새 문서가 생성되면 알림',
  mcpError: 'MCP 연결 오류 알림',
  weeklyDigest: '주간 요약 메일',
}

function NotificationSection() {
  const [value, setValue] = useState<NotificationSettings | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchNotifications(controller.signal).then(setValue).catch(() => {})
    return () => controller.abort()
  }, [])

  const toggle = async (key: keyof NotificationSettings) => {
    if (!value) return
    const prev = value
    const next = { ...value, [key]: !value[key] }
    setValue(next)
    setError('')
    try {
      await saveNotifications(next)
    } catch (err) {
      setValue(prev)
      setError(errorMessage(err))
    }
  }

  return (
    <section className="card" aria-labelledby="s-noti">
      <h2 id="s-noti" className="card__title">알림</h2>
      <p className="card__desc">받고 싶은 알림만 켜두세요.</p>
      {value === null ? (
        <p className="muted">불러오는 중...</p>
      ) : (
        <ul className="list">
          {(Object.keys(NOTIFICATION_LABELS) as (keyof NotificationSettings)[]).map((key) => (
            <li key={key} className="list__item">
              <span id={`n-${key}`}>{NOTIFICATION_LABELS[key]}</span>
              <button
                type="button"
                role="switch"
                aria-checked={value[key]}
                aria-labelledby={`n-${key}`}
                className="switch"
                onClick={() => toggle(key)}
              />
            </li>
          ))}
        </ul>
      )}
      {error && <p className="msg msg--error" role="alert">{error}</p>}
    </section>
  )
}

function SettingsPage() {
  return (
    <main className="page page--narrow">
      <style>{styles}</style>
      <div className="page__head">
        <h1 className="page__title">설정</h1>
        <p className="page__subtitle">저장소, 연동, 계정, 알림을 관리합니다</p>
      </div>
      <div className="settings">
        <RepositorySection />
        <IlgamSection />
        <McpSection />
        <AccountSection />
        <NotificationSection />
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
.msg--ok { color: #4ade80; }
.badge { padding: 2px 8px; border-radius: 999px; background: var(--surface-2); color: var(--text-muted); font-size: 12px; font-weight: 500; }
.badge--ok { background: rgba(74, 222, 128, 0.12); color: #4ade80; }
.badge--err { background: rgba(255, 107, 107, 0.12); color: var(--error); }
.dot { display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; }
.dot--ok { background: #4ade80; }
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
