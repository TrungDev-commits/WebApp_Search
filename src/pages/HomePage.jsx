import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SmartSearch, LinkPasteArea } from '../components/dashboard'
import { ComparisonTable } from '../components/comparison'
import { SparklesIcon } from '@heroicons/react/24/outline'
import useCompareStore from '../stores/useCompareStore'
import useHistoryStore from '../stores/useHistoryStore'
import useAuthStore from '../stores/useAuthStore'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import Header from '../components/layout/Header'

export default function HomePage() {
  const { data, isLoading, setData, setLoading, setError } = useCompareStore()
  const addItem = useHistoryStore((s) => s.addItem)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [mode, setMode] = useState('search')

  const handleCompare = async (input) => {
    setLoading(true)
    try {
      const result = await api.compare({ text: input })
      setData(result)
      if (isAuthenticated && result._id) {
        addItem(result)
      }
      toast.success('Phân tích hoàn tất!')
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Có lỗi xảy ra')
    }
  }

  return (
    <div className="content-area mx-auto pb-8 lg:pb-0">
      <Header />

      <div className="text-center mb-6 md:mb-8 lg:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 mb-3 md:mb-4">
          <SparklesIcon className="w-3.5 h-3.5 text-brand-600" />
          <span className="text-[11px] md:text-xs font-semibold text-brand-700">
            So sánh thông minh với AI
          </span>
        </div>
        <h1 className="text-[22px] md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 text-balance">
          Bạn muốn so sánh gì?
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-1.5 max-w-md mx-auto">
          Nhập thông tin hoặc dán link, AI sẽ phân tích và so sánh giúp bạn
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-6 md:mb-8">
        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setMode('search')}
              className={`flex-1 py-3 md:py-3.5 text-sm md:text-base font-medium text-center transition-all duration-200 relative ${
                mode === 'search' ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
              Tìm kiếm
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`flex-1 py-3 md:py-3.5 text-sm md:text-base font-medium text-center transition-all duration-200 relative ${
                mode === 'paste' ? 'text-brand-600' : 'text-slate-400'
              }`}
            >
              Dán Link / Text
            </button>
          </div>
          <div className="h-0.5 bg-slate-100 relative">
            <div
              className={`absolute bottom-0 h-0.5 bg-brand-600 rounded-full transition-all duration-200 ${
                mode === 'search' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'
              }`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="mt-4 md:mt-5"
          >
            {mode === 'search' ? (
              <div className="bg-white rounded-lg border border-slate-100 p-4 md:p-6">
                <SmartSearch onSearch={handleCompare} isLoading={isLoading} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-100 p-4 md:p-6">
                <LinkPasteArea onCompare={handleCompare} isLoading={isLoading} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ComparisonTable data={data} isLoading={isLoading} />
    </div>
  )
}
