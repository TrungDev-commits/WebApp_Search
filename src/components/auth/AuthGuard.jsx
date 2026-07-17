import useAuthStore from '../../stores/useAuthStore'
import GoogleLoginButton from './GoogleLoginButton'

export default function AuthGuard({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center mb-5 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Đăng nhập để tiếp tục</h2>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Sử dụng tài khoản Google để xem lịch sử so sánh
        </p>
        <GoogleLoginButton />
      </div>
    )
  }

  return children
}
