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

// 인증 헤더를 붙여 API를 호출한다.
export function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getToken() ?? ''}`,
      ...init.headers,
    },
  })
}
