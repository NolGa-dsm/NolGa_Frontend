import { API_BASE_URL } from './api'

export interface TrackedRepository {
  id: string
  name: string // 예: nolga/api-server
}

export interface McpClient {
  name: string // 예: Claude Code, Cursor
  status: 'connected' | 'error'
  lastCalledAt: string | null // ISO date-time
}

export interface McpStatus {
  status: 'connected' | 'disconnected'
  checkedAt: string
  clients: McpClient[]
}

export interface NotificationSettings {
  documentCreated: boolean
  mcpError: boolean
  weeklyDigest: boolean
}

export interface IlgamSettings {
  url: string
  connected: boolean
}

async function request<T>(path: string, init: RequestInit = {}, fallback?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
        ...init.headers,
      },
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? `HTTP ${res.status}`)
    }
    return (res.status === 204 ? undefined : await res.json()) as T
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    if (fallback !== undefined) return fallback
    throw err
  }
}

// 저장소/일감 연동의 등록은 MCP가 담당하고, 웹에서는 조회·수정·삭제만 한다.
// TODO: 백엔드 연동 후 fallback(샘플) 제거, 엔드포인트/필드명 조정
export const fetchTrackedRepositories = (signal?: AbortSignal) =>
  request<TrackedRepository[]>('/api/settings/repositories', { signal }, [
    { id: '1', name: 'nolga/api-server' },
    { id: '2', name: 'nolga/web' },
  ])

export const removeRepository = (id: string) =>
  request<void>(`/api/settings/repositories/${id}`, { method: 'DELETE' })

export const fetchMcpStatus = (signal?: AbortSignal) =>
  request<McpStatus>('/api/settings/mcp', { signal }, {
    status: 'connected',
    checkedAt: new Date().toISOString(),
    clients: [
      { name: 'Claude Code', status: 'connected', lastCalledAt: '2026-10-08T09:12:00Z' },
      { name: 'Cursor', status: 'error', lastCalledAt: null },
    ],
  })

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<void>('/api/account/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

export const fetchNotifications = (signal?: AbortSignal) =>
  request<NotificationSettings>('/api/settings/notifications', { signal }, {
    documentCreated: true,
    mcpError: true,
    weeklyDigest: false,
  })

export const saveNotifications = (value: NotificationSettings) =>
  request<NotificationSettings>('/api/settings/notifications', {
    method: 'PUT',
    body: JSON.stringify(value),
  })

export const fetchIlgam = (signal?: AbortSignal) =>
  request<IlgamSettings>('/api/settings/integrations/ilgam', { signal }, {
    url: '',
    connected: false,
  })

export const saveIlgam = (url: string, apiKey: string) =>
  request<IlgamSettings>('/api/settings/integrations/ilgam', {
    method: 'PUT',
    body: JSON.stringify({ url, apiKey }),
  })

export const disconnectIlgam = () =>
  request<void>('/api/settings/integrations/ilgam', { method: 'DELETE' })
