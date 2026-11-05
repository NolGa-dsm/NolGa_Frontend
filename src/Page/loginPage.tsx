import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoginBrand from '../components/LoginBrand'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'
import { isLoggedIn } from '../api'
import { loginStyles } from './loginStyles'

type Mode = 'login' | 'signup'

function LoginPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [notice, setNotice] = useState('')

  // 이미 로그인된 상태면 로그인 화면 대신 바로 대시보드로 이동
  if (isLoggedIn()) return <Navigate to="/dashboard" replace />

  const isLogin = mode === 'login'

  return (
    <main className="login">
      <style>{loginStyles}</style>
      <LoginBrand />

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

export default LoginPage
