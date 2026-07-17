import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ComparisonTable } from '../components/comparison'
import Header from '../components/layout/Header'
import { Button } from '../components/ui'
import { api } from '../services/api'
import toast from 'react-hot-toast'

export default function ComparePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id === 'latest') {
      setIsLoading(false)
      setData(null)
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await api.getHistoryById(id)
        setData(result)
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu')
        toast.error('Không thể tải dữ liệu so sánh')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  return (
    <div className="content-area mx-auto pb-8 lg:pb-0">
      <Header title="So sánh" showBack />

      {id === 'latest' ? (
        <div className="empty-state">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mb-4">
            <svg className="w-9 h-9 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-base text-slate-400 mb-4">Chưa có dữ liệu so sánh</p>
          <Button variant="secondary" onClick={() => navigate('/')} className="max-w-xs">
            Bắt đầu so sánh
          </Button>
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg className="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-base text-slate-900 font-medium mb-1">Không tìm thấy dữ liệu</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <Button variant="secondary" onClick={() => navigate('/')} className="max-w-xs">
            Quay về trang chủ
          </Button>
        </div>
      ) : (
        <ComparisonTable data={data} isLoading={isLoading} />
      )}
    </div>
  )
}
