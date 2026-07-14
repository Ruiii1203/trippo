import { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  children: ReactNode
}

function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    'trippo-btn',
    `trippo-btn-${variant}`,
    `trippo-btn-${size}`,
    block ? 'trippo-btn-block' : '',
    disabled ? 'trippo-btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button