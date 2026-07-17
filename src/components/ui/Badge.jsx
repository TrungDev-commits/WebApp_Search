import { twMerge } from 'tailwind-merge'

const variants = {
  primary: 'bg-brand-100 text-brand-700',
  accent: 'bg-accent-100 text-accent-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  slate: 'bg-slate-100 text-slate-600',
  danger: 'bg-red-100 text-red-700',
}

export default function Badge({ children, variant = 'primary', className }) {
  return (
    <span className={twMerge('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
