import { NavLink } from 'react-router-dom'
import { MagnifyingGlassIcon, ArrowsRightLeftIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline'
import useAuthStore from '../../stores/useAuthStore'
import UserAvatar from '../auth/UserAvatar'
import GoogleLoginButton from '../auth/GoogleLoginButton'

const links = [
  { to: '/', label: 'Tra cứu', icon: MagnifyingGlassIcon },
  { to: '/compare/latest', label: 'So sánh', icon: ArrowsRightLeftIcon },
  { to: '/history', label: 'Lịch sử', icon: ClockIcon },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:min-h-screen lg:bg-white lg:border-r lg:border-slate-200 lg:fixed lg:left-0 lg:top-0">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900">So Sánh</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Thông Minh</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100">
        {user ? (
          <div className="flex items-center gap-3 px-2">
            <UserAvatar />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="px-2">
            <p className="text-xs text-slate-400 text-center mb-3">Đăng nhập để đồng bộ lịch sử</p>
            <GoogleLoginButton />
          </div>
        )}
      </div>
    </aside>
  )
}
