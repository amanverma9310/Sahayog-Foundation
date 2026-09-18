import { Link } from 'react-router-dom'

const variants = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  className = '',
  children,
  icon: Icon,
  ...props
}) {
  const classes = `${variants[variant]} ${className}`
  const content = (
    <>
      {children}
      {Icon && <Icon size={17} strokeWidth={2} />}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {content}
    </button>
  )
}
