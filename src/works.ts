import { authFetch, readError } from './api'

export type WorkStatus = 'auto' | 'review' | 'edited'

export interface Work {
  id: string
  title: string
  summary: string
  repository: string
  author: string
  createdAt: string // ISO date
  status: WorkStatus
}

export interface ChangedFile {
  path: string
  type: 'added' | 'modified' | 'deleted'
  additions: number
  deletions: number
}

// 문서와 연결된 이슈/티켓 (번호만 있고 링크가 없을 수도 있음)
export interface RelatedIssue {
  key: string // 예: API-142, #37
  title?: string
  url?: string
}

export interface WorkDetail extends Work {
  branch?: string // 한 브랜치 = 한 사람의 한 작업 단위
  request?: string // "이런 작업 했어, 문서화해줘" 자연어 요청 원문
  styleName?: string // 문서 생성 시 적용된 계정/조직 스타일
  changes: ChangedFile[]
  issues: RelatedIssue[]
}

export const STATUS_LABEL: Record<WorkStatus, string> = {
  auto: '자동 생성',
  review: '검토 대기',
  edited: '수정됨',
}

export interface WorkFilters {
  page?: number
  size?: number
  repository?: string
  q?: string
  status?: WorkStatus
  author?: string
  created_from?: string // YYYY-MM-DD
  created_to?: string
}

type Raw = Record<string, unknown>

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback)

// 목록 응답(WorkResponse)을 화면 모델로 변환한다. summary/repository는 null일 수 있다.
function toWork(r: Raw): Work {
  return {
    id: String(r.id),
    title: str(r.title),
    summary: str(r.summary),
    repository: str(r.repository),
    author: str(r.author),
    createdAt: str(r.createdAt ?? r.created_at),
    status: (r.status as WorkStatus) ?? 'auto',
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await authFetch(path, init)
  if (!res.ok && res.status !== 404) throw new Error(await readError(res, `HTTP ${res.status}`))
  return res
}

export async function fetchWorks(
  signal?: AbortSignal,
  filters: WorkFilters = { size: 100 },
): Promise<Work[]> {
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== '') params.set(k, String(v))
  }
  const qs = params.toString()
  const res = await request(`/api/works${qs ? `?${qs}` : ''}`, { signal })
  return ((await res.json()) as Raw[]).map(toWork)
}

// 내가 작성한 작업만 반환
export async function fetchMyWorks(signal?: AbortSignal): Promise<Work[]> {
  const res = await request('/api/works/me', { signal })
  return ((await res.json()) as Raw[]).map(toWork)
}

// WorkDetailResponse 스키마가 명세에 없어 필드명을 방어적으로 해석한다.
// sources 중 type이 issue인 항목은 관련 이슈로 표시한다.
function toDetail(r: Raw): WorkDetail {
  const changes = Array.isArray(r.changes) ? (r.changes as Raw[]) : []
  const sources = Array.isArray(r.sources) ? (r.sources as Raw[]) : []
  return {
    ...toWork(r),
    branch: str(r.branch) || undefined,
    request: str(r.request) || undefined,
    styleName: str(r.styleName ?? r.style_name) || undefined,
    changes: changes.map((c) => ({
      path: str(c.path),
      type: (c.type as ChangedFile['type']) ?? 'modified',
      additions: Number(c.additions ?? 0),
      deletions: Number(c.deletions ?? 0),
    })),
    issues: sources
      .filter((s) => s.type === 'issue')
      .map((s) => ({ key: str(s.title), url: str(s.url) || undefined })),
  }
}

export async function fetchWork(id: string, signal?: AbortSignal): Promise<WorkDetail | null> {
  const res = await request(`/api/works/${encodeURIComponent(id)}`, { signal })
  if (res.status === 404) return null
  return toDetail((await res.json()) as Raw)
}

// 요약 수정 시 서버가 status를 edited로 바꾼다.
export async function updateWorkSummary(id: string, summary: string): Promise<void> {
  await request(`/api/works/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary }),
  })
}

// 작업 삭제 API는 아직 명세에 없다. 백엔드에 추가되면 DELETE /api/works/{id}로 연동한다.
export async function deleteWork(id: string): Promise<void> {
  await request(`/api/works/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export function matchesQuery(work: Work, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [work.title, work.summary, work.repository, work.author].some((v) =>
    v.toLowerCase().includes(q),
  )
}
