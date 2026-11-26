import { authFetch } from './api'

export interface NotificationSettings {
  documentCreated: boolean
  mcpError: boolean
  weeklyDigest: boolean
}

export interface IlgamSettings {
  url: string
  connected: boolean
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await authFetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message ?? `HTTP ${res.status}`)
  }
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<void>('/api/account/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

export const fetchNotifications = (signal?: AbortSignal) =>
  request<NotificationSettings>('/api/settings/notifications', { signal })

export const saveNotifications = (value: NotificationSettings) =>
  request<NotificationSettings>('/api/settings/notifications', {
    method: 'PUT',
    body: JSON.stringify(value),
  })

// 일감 연동의 등록은 MCP가 담당하고, 웹에서는 조회·수정·삭제만 한다.
export const fetchIlgam = (signal?: AbortSignal) =>
  request<IlgamSettings>('/api/settings/integrations/ilgam', { signal })

export const saveIlgam = (url: string, apiKey: string) =>
  request<IlgamSettings>('/api/settings/integrations/ilgam', {
    method: 'PUT',
    body: JSON.stringify({ url, apiKey }),
  })

export const disconnectIlgam = () =>
  request<void>('/api/settings/integrations/ilgam', { method: 'DELETE' })
