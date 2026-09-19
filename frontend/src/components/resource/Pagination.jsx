import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, limit, total, onPageChange }) {
  if (!total || total <= limit) return null
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
      <p className="text-xs text-gray-500">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
