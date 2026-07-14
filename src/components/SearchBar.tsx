import { useState, useRef, useEffect, InputHTMLAttributes } from 'react'

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  value?: string
  defaultValue?: string
  placeholder?: string
  variant?: 'filled' | 'outlined'
  autoFocus?: boolean
  showClearButton?: boolean
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onClear?: () => void
}

function SearchBar({
  value: controlledValue,
  defaultValue = '',
  placeholder = '搜索',
  variant = 'filled',
  autoFocus = false,
  showClearButton = true,
  onChange,
  onSubmit,
  onClear,
  className = '',
  ...rest
}: SearchBarProps) {
  const isControlled = controlledValue !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const value = isControlled ? controlledValue! : internalValue

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit?.(value)
    }
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('')
    }
    onChange?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  const baseClasses = [
    'search-bar',
    `search-bar-${variant}`,
    isFocused ? 'search-bar-focused' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={baseClasses}>
      <span className="search-bar-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        className="search-bar-input"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {showClearButton && value && (
        <button
          className="search-bar-clear"
          onClick={handleClear}
          tabIndex={-1}
          aria-label="清除搜索"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default SearchBar