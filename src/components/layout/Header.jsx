import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../../stores/useAuthStore'
import UserAvatar from '../auth/UserAvatar'
import { GoogleLogin } from '@react-oauth/google'
import { api } from '../../services/api'
import toast from 'react-hot-toast'

export default function Header({ title, showBack = false, onBack, className = '', rightAction }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const data = await api.verifyGoogleToken(credentialResponse.credential)
      setUser(data.user, data.token)
      localStorage.setItem('auth_token', data.token)
      toast.success('Đăng nhập thành công!')
    } catch {
      toast.error('Đăng nhập thất bại')
    }
  }

  return (
    <header className={`lg:hidden flex items-center justify-between h-12 mb-4 md:mb-5 ${className}`}>
      <div className="flex items-center min-w-[60px]">
        {showBack && (
          <button onClick={handleBack} className="btn-ghost -ml-2 flex items-center gap-1">
            <ChevronLeftIcon className="w-5 h-5" />
            <span className="text-sm">Quay lại</span>
          </button>
        )}
      </div>

      {title && (
        <h1 className="text-[17px] font-semibold text-slate-900 text-center flex-1">
          {title}
        </h1>
      )}

      <div className="flex items-center justify-end min-w-[60px]">
        {rightAction}
        {user && !rightAction ? (
          <UserAvatar />
        ) : !rightAction ? (
          <div className="scale-[0.65] origin-right">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => toast.error('Đăng nhập thất bại')}
              theme="outline"
              size="medium"
              shape="pill"
              text="signin_with"
            />
          </div>
        ) : null}
      </div>
    </header>
  )
}
