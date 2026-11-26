import { authFetch, readError } from './api'

export interface ApiKey {
  id: number
  name: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}

// api_key 원문은 생성 응답에서만 내려온다.
export interface CreatedApiKey extends ApiKey {
  api_key: string
}

export async function fetchApiKeys(signal?: AbortSignal): Promise<ApiKey[]> {
  const res = await authFetch('/api-keys', { signal })
  if (!res.ok) throw new Error(await readError(res, `HTTP ${res.status}`))
  return (await res.json()) as ApiKey[]
}

export async function createApiKey(name: string): Promise<CreatedApiKey> {
  const res = await authFetch('/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(await readError(res, `HTTP ${res.status}`))
  return (await res.json()) as CreatedApiKey
}

export async function revokeApiKey(id: number): Promise<void> {
  const res = await authFetch(`/api-keys/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readError(res, `HTTP ${res.status}`))
}
