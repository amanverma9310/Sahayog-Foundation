export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {Icon && (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-pine-50 text-pine-500">
          <Icon size={24} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-display text-xl text-pine-700">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-moss">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
