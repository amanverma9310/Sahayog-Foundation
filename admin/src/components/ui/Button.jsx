import { Loader2 } from 'lucide-react'

const variants = { primary: 'btn-primary', outline: 'btn-outline', danger: 'btn-danger', ghost: 'btn-ghost' }

export default function Button({ variant = 'primary', loading, children, className = '', ...props }) {
  return (
    <button className={`${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  )
}
