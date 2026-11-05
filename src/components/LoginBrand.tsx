import { useEffect, useState } from 'react'
import { API_BASE_URL, isAbortError } from '../api'

// TODO: 백엔드 응답 스펙에 맞게 엔드포인트/필드명 조정
interface Stats {
  documentCount: number
  repositoryCount: number
}

function LoginBrand() {
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
        if (!isAbortError(err)) setStats(null)
      })
    return () => controller.abort()
  }, [])

  return (
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
  )
}

export default LoginBrand
