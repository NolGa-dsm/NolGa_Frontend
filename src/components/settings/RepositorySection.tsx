import { useEffect, useState } from 'react'
import {
  fetchTrackedRepositories,
  removeRepository,
  type TrackedRepository,
} from '../../settings'
import { errorMessage } from './errorMessage'

function RepositorySection() {
  const [repos, setRepos] = useState<TrackedRepository[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchTrackedRepositories(controller.signal).then(setRepos).catch(() => {})
    return () => controller.abort()
  }, [])

  const remove = async (id: string) => {
    try {
      await removeRepository(id)
      setRepos((prev) => (prev ?? []).filter((r) => r.id !== id))
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <section className="card" aria-labelledby="s-repo">
      <h2 id="s-repo" className="card__title">저장소 연동 상태</h2>
      {error && <p className="msg msg--error" role="alert">{error}</p>}
      {repos === null ? (
        <p className="muted">불러오는 중...</p>
      ) : repos.length === 0 ? (
        <p className="muted">등록된 저장소가 없습니다. MCP에서 저장소를 등록해 주세요.</p>
      ) : (
        <ul className="list">
          {repos.map((r) => (
            <li key={r.id} className="list__item">
              <span className="mono">{r.name}</span>
              <button type="button" className="btn" onClick={() => remove(r.id)}>해제</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RepositorySection
