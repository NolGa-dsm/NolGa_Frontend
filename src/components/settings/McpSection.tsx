import { useCallback, useEffect, useState } from 'react'
import {
  fetchMcpStatus,
  type McpStatus,
} from '../../settings'

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

export default McpSection
