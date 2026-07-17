import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { formatDate } from '../../utils/formatters'

export default function HistoryCard({ item, onDelete }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (item._id === 'demo') return
    navigate(`/compare/${item._id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete?.(item._id)
  }

  return (
    <div
      onClick={handleClick}
      className="list-row cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] md:text-base font-medium text-slate-900 truncate">
          {item.searchQuery || 'So sánh không tiêu đề'}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500">
            {item.items?.length || 0} mục
          </span>
          <span className="text-[10px] text-slate-300">·</span>
          <span className="text-xs text-slate-500">
            {formatDate(item.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={handleDelete}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <ChevronRightIcon className="w-4 h-4 text-slate-300" />
      </div>
    </div>
  )
}
