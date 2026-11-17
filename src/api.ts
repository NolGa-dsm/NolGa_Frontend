export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const TOKEN_KEY = 'accessToken'
const USERNAME_KEY = 'username'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUsername = () => localStorage.getItem(USERNAME_KEY)
export const isLoggedIn = () => !!getToken()

export function saveSession(token: string, username: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USERNAME_KEY, username)
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === 'AbortError'

// FastAPI 에러 응답({ detail: string | ValidationError[] })에서 메시지를 뽑는다.
export async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null)
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg)
  return body?.message ?? fallback
}

// 인증 헤더를 붙여 API를 호출한다. 401이면 세션을 지우고 로그인 화면으로 보낸다.
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken() ?? ''}`,
      ...init.headers,
    },
  })
  if (res.status === 401 && getToken()) {
    clearSession()
    window.location.assign('/login')
  }
  return res
}

export interface AccessTokenResponse {
  access_token: string
  token_type: string
}

async function postAuth(path: 'login' | 'signup', username: string, password: string, fallback: string) {
  const res = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error(await readError(res, fallback))
  return (await res.json()) as AccessTokenResponse
}

export const login = (username: string, password: string) =>
  postAuth('login', username, password, '아이디 또는 비밀번호가 올바르지 않습니다.')

export const signup = (username: string, password: string) =>
  postAuth('signup', username, password, '회원가입에 실패했습니다.')

export async function logout(): Promise<void> {
  try {
    await authFetch('/auth/logout', { method: 'POST' })
  } catch {
    // 서버 호출 실패와 무관하게 로컬 세션은 지운다
  }
}
