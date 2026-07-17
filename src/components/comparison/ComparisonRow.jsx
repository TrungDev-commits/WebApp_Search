import Badge from '../ui/Badge'
import RatingStars from './RatingStars'
import HighlightBadge from './HighlightBadge'
import { formatPrice } from '../../utils/formatters'

export default function ComparisonRow({ item, highlights = {}, index }) {
  const isBestPrice = highlights.bestPrice === index
  const isBestRating = highlights.bestRating === index
  const isMostFeatures = highlights.mostFeatures === index

  const hls = []
  if (isBestPrice) hls.push('bestPrice')
  if (isBestRating) hls.push('bestRating')
  if (isMostFeatures) hls.push('mostFeatures')

  return (
    <div className={`card overflow-hidden ${isBestPrice ? 'ring-1 ring-brand-300' : ''}`}>
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                #{index + 1}
              </span>
              {hls.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {hls.map((h) => (
                    <HighlightBadge key={h} type={h} />
                  ))}
                </div>
              )}
            </div>
            <h3 className="font-semibold text-[15px] md:text-base text-slate-900 leading-snug">
              {item.name}
            </h3>
            {item.location && (
              <p className="text-[13px] md:text-sm text-slate-500 mt-0.5">{item.location}</p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg md:text-xl font-bold text-slate-900">{formatPrice(item.price)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.features?.map((f, i) => (
            <Badge key={i} variant="primary">{f}</Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
          <div className="bg-brand-50/50 rounded-lg p-2.5 md:p-3">
            <p className="text-[10px] md:text-xs font-semibold text-brand-700 uppercase tracking-wider mb-1">
              Ưu điểm
            </p>
            <p className="text-[13px] md:text-sm text-slate-600 leading-snug">{item.pros}</p>
          </div>
          <div className="bg-red-50/50 rounded-lg p-2.5 md:p-3">
            <p className="text-[10px] md:text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
              Nhược điểm
            </p>
            <p className="text-[13px] md:text-sm text-slate-600 leading-snug">{item.cons}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Rating
            </span>
            <RatingStars rating={item.aiRating} />
          </div>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] md:text-sm text-brand-600 font-medium hover:underline"
            >
              Nguồn ↗
            </a>
          )}
        </div>

        {item.aiComment && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nhận xét
            </p>
            <p className="text-[13px] md:text-sm text-slate-500 italic leading-snug">
              &ldquo;{item.aiComment}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
