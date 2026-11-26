import { useEffect, useState, type FormEvent } from 'react'
import {
  createApiKey,
  fetchApiKeys,
  revokeApiKey,
  type ApiKey,
  type CreatedApiKey,
} from '../../apiKeys'
import { errorMessage } from './errorMessage'

const MCP_URL = import.meta.env.VITE_MCP_URL ?? 'https://nolga-mcp.sungju.xyz/mcp'

const buildPrompt = (apiKey: string) => `아래 정보로 nolga-mcp MCP 서버를 등록해줘
- API 키: ${apiKey}
- 서버 이름: nolga-mcp
- URL: ${MCP_URL}
- 인증 헤더: Authorization: Bearer ${apiKey}`

function McpSection() {
  const [keys, setKeys] = useState<ApiKey[] | null>(null)
  const [name, setName] = useState('')
  const [created, setCreated] = useState<CreatedApiKey | null>(null)
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetchApiKeys(controller.signal)
      .then(setKeys)
      .catch((err) => {
        if (!controller.signal.aborted) {
          setKeys([])
          setError(errorMessage(err))
        }
      })
    return () => controller.abort()
  }, [])

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
    } catch {
      setError('클립보드에 복사하지 못했습니다.')
    }
  }

  const create = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('API Key 이름을 입력해주세요.')
    if (trimmed.length > 64) return setError('이름은 64자 이하여야 합니다.')
    setError('')
    setSubmitting(true)
    try {
      const key = await createApiKey(trimmed)
      setCreated(key)
      setCopied('')
      setName('')
      setKeys((prev) => [key, ...(prev ?? [])])
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const revoke = async (id: number) => {
    try {
      await revokeApiKey(id)
      setKeys((prev) =>
        (prev ?? []).map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k)),
      )
      if (created?.id === id) setCreated(null)
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('ko-KR')

  return (
    <section className="card" aria-labelledby="s-mcp">
      <h2 id="s-mcp" className="card__title">MCP 연결</h2>
      <p className="card__desc">
        API Key를 발급해 에디터/툴에 NolGa MCP 서버를 등록하세요.
      </p>

      <div className="row">
        <span className="muted">서버 URL</span>
        <code className="mono">{MCP_URL}</code>
        <button type="button" className="btn" onClick={() => copy('url', MCP_URL)}>
          {copied === 'url' ? '복사됨' : '복사'}
        </button>
      </div>

      <form className="row" onSubmit={create} noValidate>
        <input
          className="input"
          placeholder="API Key 이름 (예: My Laptop)"
          aria-label="API Key 이름"
          maxLength={64}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          API Key 발급
        </button>
      </form>

      {error && <p className="msg msg--error" role="alert">{error}</p>}

      {created && (
        <div className="stack" style={{ marginTop: 16 }}>
          <p className="msg msg--ok" role="status">
            API Key가 발급되었습니다. 이 화면을 벗어나면 다시 볼 수 없으니 지금 복사해 두세요.
          </p>
          <textarea
            className="input mono"
            readOnly
            rows={5}
            aria-label="MCP 등록 프롬프트"
            value={buildPrompt(created.api_key)}
          />
          <div className="row">
            <button type="button" className="btn" onClick={() => copy('prompt', buildPrompt(created.api_key))}>
              {copied === 'prompt' ? '복사됨' : '등록 프롬프트 복사'}
            </button>
            <button type="button" className="btn" onClick={() => copy('key', created.api_key)}>
              {copied === 'key' ? '복사됨' : 'API Key만 복사'}
            </button>
          </div>
        </div>
      )}

      {keys === null ? (
        <p className="muted">불러오는 중...</p>
      ) : keys.length === 0 ? (
        <p className="muted" style={{ marginTop: 16 }}>발급된 API Key가 없습니다.</p>
      ) : (
        <ul className="list">
          {keys.map((k) => (
            <li key={k.id} className="list__item">
              <span>
                {k.name}{' '}
                {k.revoked_at && <span className="badge badge--err">폐기됨</span>}
              </span>
              <span className="row" style={{ margin: 0 }}>
                <span className="muted">
                  {fmt(k.created_at)} 발급 · {fmt(k.expires_at)} 만료
                </span>
                {!k.revoked_at && (
                  <button type="button" className="btn" onClick={() => revoke(k.id)}>
                    폐기
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default McpSection
