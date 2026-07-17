import { twMerge } from 'tailwind-merge'

export default function Card({ children, className, onClick, hover = false }) {
  return (
    <div
      className={twMerge(
        hover ? 'card-hover' : 'card',
        onClick && 'cursor-pointer haptic-tap',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
