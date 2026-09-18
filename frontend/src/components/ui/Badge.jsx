export default function Badge({ children, tone = 'pine' }) {
  const tones = {
    pine: 'bg-pine-50 text-pine-600',
    marigold: 'bg-marigold-50 text-marigold-700',
    neutral: 'bg-paper-dim text-moss',
  }
  return (
    <span className={`inline-flex items-center rounded-[3px] px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
