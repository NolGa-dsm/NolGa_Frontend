import { authFetch, readError } from './api'

export interface Notification {
  id: number
  workId: string
  workTitle: string
  isRead: boolean
  createdAt: string // ISO date-time
  title: string
  message: string
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await authFetch(path, init)
  if (!res.ok) throw new Error(await readError(res, `HTTP ${res.status}`))
  return (await res.json()) as T
}

export const fetchNotificationList = (signal?: AbortSignal) =>
  json<Notification[]>('/api/notifications', { signal })

export const fetchUnreadCount = async (signal?: AbortSignal) =>
  (await json<{ unread_count: number }>('/api/notifications/unread-count', { signal })).unread_count

export const markNotificationRead = (id: number) =>
  json<Notification>(`/api/notifications/${id}/read`, { method: 'PATCH' })

export const markAllNotificationsRead = async () =>
  (await json<{ updated_count: number }>('/api/notifications/read-all', { method: 'PATCH' })).updated_count
