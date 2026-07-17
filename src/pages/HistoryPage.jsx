import { useEffect } from 'react'
import { HistoryList } from '../components/history'
import useHistoryStore from '../stores/useHistoryStore'
import useAuthStore from '../stores/useAuthStore'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import Header from '../components/layout/Header'

export default function HistoryPage() {
  const { items, isLoading, setItems, setLoading, removeItem } = useHistoryStore()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      api.getHistory()
        .then((data) => setItems(data))
        .catch(() => setItems([]))
    } else {
      setItems([])
    }
  }, [isAuthenticated])

  const handleDelete = async (id) => {
    try {
      await api.deleteHistory(id)
      removeItem(id)
      toast.success('Đã xóa')
    } catch {
      toast.error('Xóa thất bại')
    }
  }

  return (
    <div className="content-area mx-auto max-w-3xl pb-8 lg:pb-0">
      <Header title="Lịch sử" />

      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div>
          <h1 className="section-title hidden lg:block">Lịch sử so sánh</h1>
          <p className="section-subtitle mt-0.5">
            {isAuthenticated
              ? 'Các phiên so sánh trước đây của bạn'
              : 'Đăng nhập để xem lịch sử'}
          </p>
        </div>
        {isAuthenticated && items.length > 0 && (
          <span className="text-xs md:text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
            {items.length} phiên
          </span>
        )}
      </div>

      {!isAuthenticated && (
        <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 md:p-4 mb-4 md:mb-5">
          <p className="text-sm text-brand-700 font-medium">
            Đăng nhập để đồng bộ lịch sử so sánh của bạn
          </p>
        </div>
      )}

      <HistoryList
        items={items}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  )
}
