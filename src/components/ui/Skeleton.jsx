import { twMerge } from 'tailwind-merge'

export default function Skeleton({ className }) {
  return (
    <div className={twMerge('animate-pulse bg-brand-100/60 rounded-md', className)} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-slate-100 p-4 md:p-5 space-y-3">
      <Skeleton className="h-5 w-3/5" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-100 p-4 md:p-5 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-100 overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 lg:px-5 py-3.5">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="w-4 h-4" />
        </div>
      ))}
    </div>
  )
}
