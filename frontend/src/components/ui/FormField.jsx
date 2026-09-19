export function Field({ label, error, required, children, hint }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink">
        {label} {required && <span className="text-marigold-600">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-alert">{error.message}</p>}
    </div>
  )
}

export function TextField({ label, name, register, error, required, type = 'text', placeholder, hint, ...rest }) {
  return (
    <Field label={label} error={error} required={required} hint={hint}>
      <input id={name} type={type} placeholder={placeholder} className="input" {...register(name)} {...rest} />
    </Field>
  )
}

export function NumberField({ label, name, register, error, required, placeholder, hint }) {
  return (
    <Field label={label} error={error} required={required} hint={hint}>
      <input id={name} type="number" placeholder={placeholder} className="input" {...register(name)} />
    </Field>
  )
}

export function DateField({ label, name, register, error, required }) {
  return (
    <Field label={label} error={error} required={required}>
      <input id={name} type="date" className="input" {...register(name)} />
    </Field>
  )
}

export function TextAreaField({ label, name, register, error, required, rows = 4, placeholder }) {
  return (
    <Field label={label} error={error} required={required}>
      <textarea id={name} rows={rows} placeholder={placeholder} className="input" {...register(name)} />
    </Field>
  )
}

export function SelectField({ label, name, register, error, options, required, placeholder = 'Select…' }) {
  const normalized = options.map((opt) => (typeof opt === 'string' ? { value: opt, label: opt } : opt))
  return (
    <Field label={label} error={error} required={required}>
      <select id={name} className="input" {...register(name)}>
        <option value="">{placeholder}</option>
        {normalized.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function CheckboxField({ label, name, register }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-marigold-500" {...register(name)} />
      {label}
    </label>
  )
}

// A comma-separated free-text input that stores/reads an array field
// (used for tags, objectives, whatWeProvide, etc.) without needing a full
// tag-picker widget.
export function ListField({ label, name, register, error, hint, placeholder }) {
  return (
    <Field
      label={label}
      error={error}
      hint={hint || 'Comma-separated — each item becomes a separate list entry.'}
    >
      <input id={name} type="text" placeholder={placeholder} className="input" {...register(name)} />
    </Field>
  )
}

export function FileField({ label, name, onChange, error, required, accept, hint }) {
  return (
    <Field label={label} error={error} required={required} hint={hint}>
      <input
        id={name}
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-pine-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-pine-700 hover:file:bg-pine-100"
      />
    </Field>
  )
}
