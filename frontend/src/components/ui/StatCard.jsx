export default function StatCard({ label, value, icon: Icon, tone = 'pine' }) {
  const tones = { pine: 'bg-pine-50 text-pine-700', marigold: 'bg-marigold-50 text-marigold-600' }
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-md ${tones[tone]}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  )
}
