import { twMerge } from 'tailwind-merge'

export default function Button({ children, variant = 'primary', className, ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center w-full h-12 rounded-lg font-semibold text-sm md:text-base text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] active:bg-red-700 transition-all duration-150 disabled:opacity-40',
  }

  return (
    <button className={twMerge(variants[variant], className)} {...props}>
      {children}
    </button>
  )
}
