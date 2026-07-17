import { twMerge } from 'tailwind-merge'

export default function Input({ className, ...props }) {
  return (
    <input className={twMerge('input-field', className)} {...props} />
  )
}

export function Textarea({ className, ...props }) {
  return (
    <textarea className={twMerge('input-field min-h-[120px] md:min-h-[140px] resize-none pt-3', className)} {...props} />
  )
}
