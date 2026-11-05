import { useEffect, useState } from 'react'
import {
  fetchNotifications,
  saveNotifications,
  type NotificationSettings,
} from '../../settings'
import { errorMessage } from './errorMessage'

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

export default NotificationSection
