import { useState, type FormEvent } from 'react'
import { signup } from '../api'

interface SignupFormProps {
  onSuccess: () => void
}

function SignupForm({ onSuccess }: SignupFormProps) {
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
    if (username.trim().length < 3 || username.trim().length > 64) {
      setError('아이디는 3~64자여야 합니다.')
      return
    }
    if (password.length < 8 || password.length > 128) {
      setError('비밀번호는 8~128자여야 합니다.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await signup(username.trim(), password)
      onSuccess()
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
          autoComplete="new-password"
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
        회원가입
      </button>
    </form>
  )
}

export default SignupForm
