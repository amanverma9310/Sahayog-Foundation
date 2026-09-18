export function SkeletonLine({ className = '' }) {
  return <div className={`animate-pulse rounded bg-pine-50 ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <SkeletonLine className="h-52 w-full" />
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-4 w-1/3" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
