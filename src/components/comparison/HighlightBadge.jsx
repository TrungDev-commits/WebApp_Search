export default function HighlightBadge({ type }) {
  const config = {
    bestPrice: { label: 'Giá rẻ nhất', className: 'badge-best-price' },
    bestRating: { label: 'Đánh giá cao', className: 'badge-best-rating' },
    mostFeatures: { label: 'Nhiều tiện ích', className: 'badge-best-features' },
  }

  const item = config[type]
  if (!item) return null

  return (
    <span className={item.className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1" />
      {item.label}
    </span>
  )
}
