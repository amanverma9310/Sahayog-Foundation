export default function Spinner({ full = false }) {
  const el = <div className="h-6 w-6 animate-spin rounded-full border-2 border-pine-100 border-t-pine-600" />
  if (!full) return el
  return <div className="flex min-h-[40vh] items-center justify-center">{el}</div>
}
