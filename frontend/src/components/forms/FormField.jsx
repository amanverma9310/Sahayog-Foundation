export function TextField({ label, name, register, error, type = 'text', placeholder, required, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-pine-700">
        {label} {required && <span className="text-marigold-600">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1.5 w-full rounded-[3px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-moss/60 focus-visible:outline-marigold-500 ${
          error ? 'border-alert' : 'border-pine-100'
        }`}
        {...register(name)}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export function TextAreaField({ label, name, register, error, placeholder, required, rows = 4 }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-pine-700">
        {label} {required && <span className="text-marigold-600">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1.5 w-full rounded-[3px] border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-moss/60 focus-visible:outline-marigold-500 ${
          error ? 'border-alert' : 'border-pine-100'
        }`}
        {...register(name)}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export function SelectField({ label, name, register, error, options, required }) {
  // Supports both plain string options and { value, label } objects, so
  // selects that must submit a real id (e.g. a project's Mongo _id) while
  // displaying a human-readable label can use the same component.
  const normalized = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-pine-700">
        {label} {required && <span className="text-marigold-600">*</span>}
      </label>
      <select
        id={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`mt-1.5 w-full rounded-[3px] border bg-white px-3.5 py-2.5 text-sm text-ink focus-visible:outline-marigold-500 ${
          error ? 'border-alert' : 'border-pine-100'
        }`}
        {...register(name)}
      >
        <option value="">Select an option</option>
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-alert">
          {error.message}
        </p>
      )}
    </div>
  )
}

export function CheckboxField({ label, name, register, error }) {
  return (
    <div>
      <label htmlFor={name} className="flex items-start gap-2.5 text-sm text-moss">
        <input
          id={name}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-pine-200 text-marigold-500 focus-visible:outline-marigold-500"
          {...register(name)}
        />
        {label}
      </label>
      {error && <p className="mt-1.5 text-sm text-alert">{error.message}</p>}
    </div>
  )
}

export function FormSuccess({ title, description }) {
  return (
    <div className="rounded-sm border border-pine-100 bg-pine-50 p-8 text-center">
      <h3 className="font-display text-xl text-pine-700">{title}</h3>
      <p className="mt-2 text-moss">{description}</p>
    </div>
  )
}
