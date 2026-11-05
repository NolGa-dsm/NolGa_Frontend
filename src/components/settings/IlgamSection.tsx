import { useEffect, useState, type FormEvent } from 'react'
import {
  disconnectIlgam,
  fetchIlgam,
  saveIlgam,
  type IlgamSettings,
} from '../../settings'
import { errorMessage } from './errorMessage'

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

export default IlgamSection
