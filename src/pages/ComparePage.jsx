import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ComparisonTable } from '../components/comparison'
import Header from '../components/layout/Header'
import { Button } from '../components/ui'

const MOCK_DATA = {
  _id: 'mock1',
  searchQuery: 'Phòng trọ Vĩnh Long tầm 2 triệu',
  category: 'room',
  createdAt: new Date().toISOString(),
  items: [
    {
      name: 'Phòng trọ hẻm 4 Đường Mậu Thân',
      price: 1800000,
      location: 'Phường 3, Vĩnh Long',
      features: ['Máy lạnh', 'Gác lửng', 'Giờ giấc tự do'],
      pros: 'Giá rẻ, phòng mới sơn lại',
      cons: 'Chung chủ, hẻm hơi nhỏ',
      sourceUrl: 'https://chotot.com',
      aiRating: 8.5,
      aiComment: 'Kèo ngon nhất trong tầm giá.',
    },
    {
      name: 'Nhà trọ sinh viên giá rẻ',
      price: 2200000,
      location: 'Gần Đại học Xây dựng Miền Tây',
      features: ['Máy lạnh', 'Wifi free', 'Camera an ninh'],
      pros: 'Gần trường, an ninh tốt',
      cons: 'Giá hơi cao, tiền điện 4k/ký',
      sourceUrl: 'https://facebook.com/groups',
      aiRating: 7.5,
      aiComment: 'Hơi lố ngân sách 200k nhưng bù lại an ninh tốt.',
    },
    {
      name: 'Studio mini trung tâm thành phố',
      price: 2500000,
      location: 'Phường 1, Vĩnh Long',
      features: ['Máy lạnh', 'Tủ lạnh', 'Máy giặt', 'Bếp riêng', 'Wifi'],
      pros: 'Đầy đủ nội thất, ở được 2 người',
      cons: 'Giá cao nhất, hơi ồn mặt tiền đường',
      sourceUrl: 'https://phongtro.com',
      aiRating: 6.5,
      aiComment: 'Phù hợp cho 2 người, nhưng hơi đắt.',
    },
  ],
}

export default function ComparePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id === 'latest') {
      setIsLoading(false)
      setData(null)
      return
    }
    const timer = setTimeout(() => {
      setData(MOCK_DATA)
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
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
      ) : (
        <ComparisonTable data={data} isLoading={isLoading} />
      )}
    </div>
  )
}
