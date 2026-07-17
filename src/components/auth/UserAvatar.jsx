import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import useAuthStore from '../../stores/useAuthStore'
import toast from 'react-hot-toast'

export default function UserAvatar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  if (!user) return null

  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth_token')
    toast.success('Đã đăng xuất')
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm hover:ring-brand-300 transition-all">
        {user.picture ? (
          <img src={user.picture} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {user.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
        )}
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="mt-2 w-56 origin-top-right rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 focus:outline-none"
      >
        <div className="px-3 py-2 border-b border-slate-100 mb-1">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
        <MenuItem>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Đăng xuất
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
