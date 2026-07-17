import HistoryCard from './HistoryCard'
import { ListSkeleton } from '../ui/Skeleton'

export default function HistoryList({ items, isLoading, onDelete }) {
  if (isLoading) {
    return <ListSkeleton />
  }

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mb-4">
          <svg className="w-9 h-9 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-400">Chưa có lịch sử</h3>
        <p className="text-sm text-slate-400 mt-1 text-center">
          Các phiên so sánh của bạn sẽ xuất hiện ở đây
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden divide-y divide-slate-100">
      {items.map((item) => (
        <HistoryCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  )
}
