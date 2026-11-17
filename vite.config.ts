import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.BACKEND_URL || 'https://nolga-backend-develop.onrender.com'
  // 백엔드가 CORS를 열어두지 않아서 개발 중에는 같은 origin으로 프록시한다.
  const proxy = Object.fromEntries(
    ['/auth', '/api', '/api-keys', '/health'].map((p) => [
      p,
      { target, changeOrigin: true, secure: true },
    ]),
  )
  return { plugins: [react()], server: { proxy } }
})
