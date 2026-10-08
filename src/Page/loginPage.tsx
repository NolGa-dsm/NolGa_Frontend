import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import { API_BASE_URL } from '../api'

type Mode = 'login' | 'signup'

// TODO: 백엔드 응답 스펙에 맞게 엔드포인트/필드명 조정
interface Stats {
  documentCount: number
  repositoryCount: number
}

function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [notice, setNotice] = useState('')
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_BASE_URL}/api/stats`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<Stats>
      })
      .then(setStats)
      .catch((err) => {
        if (err.name !== 'AbortError') setStats(null)
      })
    return () => controller.abort()
  }, [])

  const isLogin = mode === 'login'

  return (
    <main className="login">
      <style>{styles}</style>
      <section className="login__brand">
        <h1 className="logo">NolGa</h1>
        <h2 className="login__headline">
          코드가 문서를
          <br />
          대신 씁니다
        </h2>
        <p className="login__desc">
          커밋과 PR을 분석해 작업 내용을 자동으로 요약하고 아카이빙합니다.
        </p>
        <div className="login__stats">
          <div>
            <span className="stat__value">
              {stats ? stats.documentCount.toLocaleString() : '-'}
            </span>
            <span className="stat__label">자동 생성 문서</span>
          </div>
          <div>
            <span className="stat__value">
              {stats ? stats.repositoryCount.toLocaleString() : '-'}
            </span>
            <span className="stat__label">연결된 저장소</span>
          </div>
        </div>
      </section>

      <section className="login__panel">
        <div className="card">
          <div className="tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className="tab"
              aria-selected={isLogin}
              onClick={() => {
                setNotice('')
                setMode('login')
              }}
            >
              로그인
            </button>
            <button
              type="button"
              role="tab"
              className="tab"
              aria-selected={!isLogin}
              onClick={() => setMode('signup')}
            >
              회원가입
            </button>
          </div>

          <h2 className="card__title">
            {isLogin ? '다시 오셨네요' : '처음 오셨나요'}
          </h2>
          <p className="card__subtitle">
            {isLogin
              ? '아이디와 비밀번호로 로그인하세요'
              : '아이디와 비밀번호로 계정을 만드세요'}
          </p>

          {notice && isLogin && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm
              onSuccess={() => {
                setNotice('회원가입이 완료되었습니다. 로그인해주세요.')
                setMode('login')
              }}
            />
          )}
        </div>
      </section>
    </main>
  )
}

const styles = `
.login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

/* Brand panel */
.login__brand {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 clamp(32px, 8vw, 120px);
  background:
    radial-gradient(
      ellipse at 20% 0%,
      rgba(79, 140, 255, 0.12),
      transparent 60%
    ),
    var(--bg);
  border-right: 1px solid var(--border);
}

.logo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 72px;
}

.login__headline {
  margin: 0 0 20px;
  font-size: clamp(32px, 3.4vw, 44px);
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.login__desc {
  margin: 0;
  max-width: 440px;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.7;
}

.login__stats {
  display: flex;
  gap: 40px;
  margin-top: 64px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
  max-width: 440px;
}

.stat__value {
  display: block;
  font-size: 24px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.stat__label {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-faint);
}

/* Form panel */
.login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: var(--surface);
}

.card {
  width: 100%;
  max-width: 420px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  margin-bottom: 40px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.tab {
  padding: 11px 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-muted);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab:hover {
  color: var(--text);
}

.tab[aria-selected='true'] {
  background: var(--surface-2);
  color: var(--text);
}

.card__title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card__subtitle {
  margin: 0 0 32px;
  color: var(--text-muted);
  font-size: 15px;
}

.field {
  display: block;
  margin-bottom: 20px;
}

.field__label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}

.field__input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field__input::placeholder {
  color: var(--text-faint);
}

.field__input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--focus-ring);
}

.error {
  margin: -4px 0 16px;
  font-size: 13px;
  color: var(--error);
}

.notice {
  margin: 0 0 16px;
  font-size: 13px;
  color: var(--primary);
}

.btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, opacity 0.15s;
}

.btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn--primary {
  margin-top: 4px;
  border: 0;
  background: var(--primary);
  color: var(--primary-ink);
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--outline {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}

.btn--outline:hover {
  border-color: var(--text-faint);
  background: var(--surface-2);
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
  color: var(--text-faint);
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.help {
  margin: 24px 0 0;
  font-size: 13px;
  color: var(--text-faint);
}

@media (max-width: 860px) {
  .login {
    grid-template-columns: 1fr;
  }

  .login__brand {
    display: none;
  }

  .login__panel {
    background: var(--bg);
  }
}
`

export default LoginPage
