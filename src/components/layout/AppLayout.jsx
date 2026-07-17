import { Outlet } from 'react-router-dom'
import BottomTab from './BottomTab'
import Sidebar from './Sidebar'
import ToastProvider from '../ui/Toast'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-brand-50">
      <ToastProvider />
      <Sidebar />
      <main className="lg:ml-64 min-h-screen safe-bottom">
        <div className="page-container py-4 md:py-6 lg:py-8">
          <Outlet />
        </div>
      </main>
      <BottomTab />
    </div>
  )
}
