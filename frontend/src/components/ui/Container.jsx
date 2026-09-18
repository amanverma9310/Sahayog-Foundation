export default function Container({ children, className = '' }) {
  return <div className={`container-edit ${className}`}>{children}</div>
}
