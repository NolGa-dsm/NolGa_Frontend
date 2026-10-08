import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import DashboardPage from './Page/dashboardPage'
import WorkDetailPage from './Page/workDetailPage'
import MyWorksPage from './Page/myWorksPage'
import LoginPage from './Page/loginPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('accessToken') ? (
    children
  ) : (
    <Navigate to="/login" replace />
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-works" element={<MyWorksPage />} />
          <Route path="/works/:id" element={<WorkDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
