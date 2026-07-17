import { motion } from 'framer-motion'
import ComparisonRow from './ComparisonRow'
import { TableSkeleton } from '../ui/Skeleton'

export default function ComparisonTable({ data, isLoading }) {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (!data || !data.items || data.items.length === 0) {
    return null
  }

  const prices = data.items.map((item, i) => ({ price: item.price ?? Infinity, index: i }))
  const ratings = data.items.map((item, i) => ({ rating: item.aiRating ?? 0, index: i }))
  const featureCounts = data.items.map((item, i) => ({
    count: item.features?.length ?? 0,
    index: i,
  }))

  const bestPrice = prices.sort((a, b) => a.price - b.price)[0]
  const bestRating = ratings.sort((a, b) => b.rating - a.rating)[0]
  const mostFeatures = featureCounts.sort((a, b) => b.count - a.count)[0]

  const highlights = {
    bestPrice: bestPrice?.index,
    bestRating: bestRating?.index,
    mostFeatures: mostFeatures?.index,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 md:space-y-5 mt-6 md:mt-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
        <h2 className="section-title">Kết quả so sánh</h2>
        <span className="text-xs md:text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 self-start">
          {data.items.length} sản phẩm
        </span>
      </div>

      {data.searchQuery && (
        <p className="text-sm md:text-base text-slate-500 mb-3">&ldquo;{data.searchQuery}&rdquo;</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {data.items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.25 }}
            className="h-full"
          >
            <ComparisonRow item={item} highlights={highlights} index={index} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
