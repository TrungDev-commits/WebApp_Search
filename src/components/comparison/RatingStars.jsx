import { StarIcon } from '@heroicons/react/24/solid'

export default function RatingStars({ rating, maxRating = 10 }) {
  const stars = 5
  const filled = Math.round((rating / maxRating) * stars)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <StarIcon
            key={i}
            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
              i < filled
                ? rating >= 8 ? 'text-brand-500' :
                  rating >= 6 ? 'text-brand-400' :
                  rating >= 4 ? 'text-accent-400' :
                  'text-red-400'
                : 'text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs md:text-sm font-semibold text-slate-500">{rating}</span>
    </div>
  )
}
