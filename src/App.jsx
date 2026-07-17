import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppLayout } from './components/layout'
import { AuthGuard } from './components/auth'
import HomePage from './pages/HomePage'
import ComparePage from './pages/ComparePage'
import HistoryPage from './pages/HistoryPage'
import useAuthStore from './stores/useAuthStore'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession)

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/compare/:id" element={<ComparePage />} />
            <Route path="/history" element={<AuthGuard><HistoryPage /></AuthGuard>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
