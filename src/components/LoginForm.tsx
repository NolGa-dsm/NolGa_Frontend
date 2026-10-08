import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api'

function LoginForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      // TODO: 백엔드 스펙에 맞게 엔드포인트/필드명 조정
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? '아이디 또는 비밀번호가 올바르지 않습니다.')
      }
      const { accessToken } = (await res.json()) as { accessToken: string }
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('username', username.trim())
      navigate('/dashboard')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '요청 중 오류가 발생했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field__label">아이디</span>
        <input
          className="field__input"
          type="text"
          autoComplete="username"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label className="field">
        <span className="field__label">비밀번호</span>
        <input
          className="field__input"
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn--primary"
        disabled={submitting}
      >
        로그인
      </button>
    </form>
  )
}

export default LoginForm
