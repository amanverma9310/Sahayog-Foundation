import { Pencil, Trash2 } from 'lucide-react'

export default function DataTable({ columns, rows, onEdit, onDelete, rowKey = 'id', emptyMessage }) {
  if (!rows || rows.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">{emptyMessage || 'No records found.'}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3 text-right font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} className="border-b border-gray-100 hover:bg-gray-50/60">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        aria-label="Edit"
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-pine-700"
                      >
                        <Pencil size={15} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        aria-label="Delete"
                        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-alert"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
