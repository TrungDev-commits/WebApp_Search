import { useNavigate } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../../stores/useAuthStore'
import UserAvatar from '../auth/UserAvatar'

export default function Header({ title, showBack = false, onBack, className = '', rightAction }) {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
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
        {user && !rightAction ? <UserAvatar /> : !rightAction && <div className="w-8 h-8" />}
      </div>
    </header>
  )
}
