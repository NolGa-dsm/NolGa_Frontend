import { useState, type FormEvent } from 'react'

function SignupForm() {
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
      // TODO: 회원가입 API 연동
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
