import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import {
  TextField, NumberField, DateField, TextAreaField, SelectField, CheckboxField, ListField,
} from '../ui/FormField'

// `fields` describes the form: [{ name, label, type, options?, required? }]
// A field with `type: 'select'` and `optionsLoader: () => Promise<options>`
// (instead of a static `options` array) loads its options once when the
// modal opens — used for pickers like "project" that come from the API.
// `record` is the item being edited (undefined when creating).
export default function ResourceFormModal({ open, onClose, onSubmit, title, fields, record, schema, submitting }) {
  const [loadedOptions, setLoadedOptions] = useState({})
  const defaultValues = buildDefaultValues(fields, record)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  })

  useEffect(() => {
    reset(buildDefaultValues(fields, record))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, open])

  useEffect(() => {
    if (!open) return
    fields
      .filter((f) => f.optionsLoader)
      .forEach((f) => {
        f.optionsLoader().then((opts) => setLoadedOptions((prev) => ({ ...prev, [f.name]: opts })))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleFormSubmit(data) {
    const payload = { ...data }
    fields.forEach((f) => {
      if (f.type === 'list') {
        payload[f.name] = (data[f.name] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (f.type === 'number' && data[f.name] === '') {
        payload[f.name] = undefined
      }
      if (!f.required && data[f.name] === '') {
        payload[f.name] = undefined
      }
    })
    onSubmit(payload)
  }

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {fields.map((f) => {
          const common = { key: f.name, label: f.label, name: f.name, register, error: errors[f.name], required: f.required }
          if (f.type === 'textarea') return <TextAreaField {...common} rows={f.rows} />
          if (f.type === 'number') return <NumberField {...common} />
          if (f.type === 'date') return <DateField {...common} />
          if (f.type === 'select') return <SelectField {...common} options={f.optionsLoader ? loadedOptions[f.name] || [] : f.options} />
          if (f.type === 'checkbox') return <CheckboxField key={f.name} label={f.label} name={f.name} register={register} />
          if (f.type === 'list') return <ListField {...common} hint={f.hint} />
          return <TextField {...common} placeholder={f.placeholder} />
        })}

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {record ? 'Save changes' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function buildDefaultValues(fields, record) {
  const values = {}
  fields.forEach((f) => {
    const raw = record?.[f.name]
    if (f.type === 'list') {
      values[f.name] = Array.isArray(raw) ? raw.join(', ') : raw || ''
    } else if (f.type === 'checkbox') {
      values[f.name] = !!raw
    } else if (f.type === 'date') {
      values[f.name] = raw ? String(raw).slice(0, 10) : ''
    } else if (f.type === 'select' && raw && typeof raw === 'object') {
      // populated reference (e.g. drive.project = { id, title, slug }) — the
      // <select> needs the plain id as its value, not the whole object
      values[f.name] = raw.id ?? ''
    } else {
      values[f.name] = raw ?? f.default ?? ''
    }
  })
  return values
}
