import { NavLink } from 'react-router-dom'
import { MagnifyingGlassIcon, ArrowsRightLeftIcon, ClockIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon as SearchSolid, ArrowsRightLeftIcon as CompareSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid'

const tabs = [
  {
    to: '/',
    label: 'Tra cứu',
    icon: MagnifyingGlassIcon,
    activeIcon: SearchSolid,
  },
  {
    to: '/compare/latest',
    label: 'So sánh',
    icon: ArrowsRightLeftIcon,
    activeIcon: CompareSolid,
  },
  {
    to: '/history',
    label: 'Lịch sử',
    icon: ClockIcon,
    activeIcon: ClockSolid,
  },
]

export default function BottomTab() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-slate-200/80 safe-bottom shadow-[0_-1px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-200 ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive
                  ? <tab.activeIcon className="w-6 h-6" />
                  : <tab.icon className="w-6 h-6" />
                }
                <span className={`text-[10px] font-semibold tracking-wide ${
                  isActive ? 'text-brand-600' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
