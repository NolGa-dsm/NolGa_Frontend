import { useState, type FormEvent } from 'react'
import {
  changePassword,
} from '../../settings'
import { getUsername } from '../../api'
import { errorMessage } from './errorMessage'

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
      <p className="card__desc">아이디: {getUsername() ?? '-'}</p>
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

export default AccountSection
