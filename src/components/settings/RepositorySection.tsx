import { useEffect, useState } from 'react'
import { fetchMyWorks } from '../../works'
import { isAbortError } from '../../api'
import { errorMessage } from './errorMessage'

interface WorkRepository {
  name: string // 예: nolga/api-server
  count: number
}

// 저장소 전용 API가 없어서 내 작업에 기록된 저장소 이름을 모아 보여준다.
// 작업은 최신순으로 오므로 최근에 작업한 저장소가 앞에 온다.
function countByRepository(names: string[]): WorkRepository[] {
  const counts = new Map<string, number>()
  for (const name of names) {
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return [...counts].map(([name, count]) => ({ name, count }))
}

function RepositorySection() {
  const [repos, setRepos] = useState<WorkRepository[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchMyWorks(controller.signal)
      .then((works) => setRepos(countByRepository(works.map((w) => w.repository))))
      .catch((err) => {
        if (!isAbortError(err)) setError(errorMessage(err))
      })
    return () => controller.abort()
  }, [])

  return (
    <section className="card" aria-labelledby="s-repo">
      <h2 id="s-repo" className="card__title">작업한 저장소</h2>
      <p className="card__desc">내가 등록한 작업에 기록된 저장소입니다.</p>
      {error ? (
        <p className="msg msg--error" role="alert">{error}</p>
      ) : repos === null ? (
        <p className="muted">불러오는 중...</p>
      ) : repos.length === 0 ? (
        <p className="muted">아직 표시할 저장소가 없습니다. MCP로 작업을 등록할 때 저장소를 함께 기록하면 여기에 표시됩니다.</p>
      ) : (
        <ul className="list">
          {repos.map((r) => (
            <li key={r.name} className="list__item">
              <span className="mono">{r.name}</span>
              <span className="muted">작업 {r.count}건</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default RepositorySection
