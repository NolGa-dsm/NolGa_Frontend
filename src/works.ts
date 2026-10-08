import { API_BASE_URL } from './api'

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

export type SourceType = 'commit' | 'issue' | 'file' | 'note'

// 문서화에 사용된 자료 (깃 커밋 외에 사내 일감, 첨부파일, 직접 입력 내용 등)
export interface WorkSource {
  id: string
  type: SourceType
  title: string
  url?: string
}

export const SOURCE_LABEL: Record<SourceType, string> = {
  commit: '커밋',
  issue: '일감/이슈',
  file: '첨부파일',
  note: '직접 입력',
}

export interface WorkDetail extends Work {
  branch?: string // 한 브랜치 = 한 사람의 한 작업 단위
  request?: string // "이런 작업 했어, 문서화해줘" 자연어 요청 원문
  styleName?: string // 문서 생성 시 적용된 계정/조직 스타일
  changes: ChangedFile[]
  sources: WorkSource[]
}

export const STATUS_LABEL: Record<WorkStatus, string> = {
  auto: '자동 생성',
  review: '검토 대기',
  edited: '수정됨',
}

// TODO: 백엔드 연동 후 제거 (API 실패 시 화면 확인용 샘플)
const SAMPLE_WORKS: Work[] = [
  {
    id: '1',
    title: '결제 웹훅 재시도 로직 개선',
    summary: '실패한 웹훅을 지수 백오프로 최대 6회 재시도하고, 실패 이벤트를 DLQ로 보냅니다.',
    repository: 'nolga/api-server',
    author: 'jihoon.kim',
    createdAt: '2026-08-24',
    status: 'auto',
  },
  {
    id: '2',
    title: '문서 요약 프롬프트 v3 적용',
    summary: '커밋 메시지 위주였던 요약을 diff 컨텍스트 기반으로 교체해 평균 요약 품질을 높입니다.',
    repository: 'nolga/summarizer',
    author: 'sena.park',
    createdAt: '2026-08-23',
    status: 'review',
  },
  {
    id: '3',
    title: '사내 SSO 로그인 연동',
    summary: 'OIDC 기반 사내 계정 로그인 추가 및 기존 username/password 로그인과 계정을 연결합니다.',
    repository: 'nolga/web',
    author: 'minu.lee',
    createdAt: '2026-08-21',
    status: 'auto',
  },
  {
    id: '4',
    title: '저장소 인덱싱 파이프라인 분리',
    summary: '인덱싱 작업을 별도 워커로 분리하고 큐 기반으로 전환, 대형 저장소 초기 인덱싱 시간을 줄입니다.',
    repository: 'nolga/indexer',
    author: 'jihoon.kim',
    createdAt: '2026-08-19',
    status: 'edited',
  },
  {
    id: '5',
    title: '문서 검색 필터 API',
    summary: '제목/repository/작성자 기준 복합 필터와 커서 페이지네이션을 지원합니다.',
    repository: 'nolga/api-server',
    author: 'hana.jung',
    createdAt: '2026-08-18',
    status: 'auto',
  },
  {
    id: '6',
    title: '이슈 트래커 링크 자동 매칭',
    summary: '브랜치명과 커밋 메시지에서 이슈 키를 추출해 관련 이슈 섹션을 자동으로 추가합니다.',
    repository: 'nolga/summarizer',
    author: 'sena.park',
    createdAt: '2026-08-17',
    status: 'auto',
  },
]

// TODO: 백엔드 응답 스펙에 맞게 엔드포인트/필드명 조정
export async function fetchWorks(signal?: AbortSignal): Promise<Work[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/works`, {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as Work[]
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    return SAMPLE_WORKS
  }
}

// TODO: 백엔드 연동 후 제거 (API 실패 시 화면 확인용 샘플)
const SAMPLE_DETAILS: Record<string, Partial<WorkDetail>> = {
  '1': {
    branch: 'feature/webhook-retry',
    request: '결제 웹훅 재시도 로직 바꾼 거 문서화해줘. 일감 API-142 참고해줘.',
    styleName: '팀 기본 스타일',
    changes: [
      { path: 'src/webhook/retry.ts', type: 'modified', additions: 64, deletions: 12 },
      { path: 'src/webhook/dlq.ts', type: 'added', additions: 38, deletions: 0 },
      { path: 'src/webhook/legacyRetry.ts', type: 'deleted', additions: 0, deletions: 51 },
    ],
    sources: [
      { id: 's1', type: 'commit', title: 'feat: 웹훅 지수 백오프 재시도 추가' },
      { id: 's2', type: 'commit', title: 'feat: 실패 이벤트 DLQ 전송' },
      { id: 's3', type: 'issue', title: 'API-142 웹훅 실패 시 이벤트 유실 문제' },
      { id: 's4', type: 'file', title: '재시도정책_논의.pdf' },
    ],
  },
}

// TODO: 백엔드 응답 스펙에 맞게 엔드포인트/필드명 조정
export async function fetchWork(id: string, signal?: AbortSignal): Promise<WorkDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/works/${encodeURIComponent(id)}`, {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return (await res.json()) as WorkDetail
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    const base = SAMPLE_WORKS.find((w) => w.id === id)
    if (!base) return null
    return { ...base, changes: [], sources: [], ...SAMPLE_DETAILS[id] }
  }
}

// TODO: 백엔드 응답 스펙에 맞게 엔드포인트/필드명 조정 (실패해도 화면에는 수정 반영)
export async function updateWorkSummary(id: string, summary: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/works/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
      },
      body: JSON.stringify({ summary }),
    })
  } catch {
    // 연동 전에는 무시
  }
}

export function matchesQuery(work: Work, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [work.title, work.summary, work.repository, work.author].some((v) =>
    v.toLowerCase().includes(q),
  )
}
