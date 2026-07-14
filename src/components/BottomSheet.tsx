import { useState, useEffect, useRef, ReactNode, useCallback } from 'react'

interface BottomSheetAction {
  key: string
  label: string
  icon?: ReactNode
  destructive?: boolean
  onClick: () => void
}

interface BottomSheetProps {
  visible: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  actions?: BottomSheetAction[]
  showCancel?: boolean
  cancelText?: string
  children?: ReactNode
  closeOnOverlayClick?: boolean
  closeOnSwipeDown?: boolean
}

function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  actions,
  showCancel = true,
  cancelText = '取消',
  children,
  closeOnOverlayClick = true,
  closeOnSwipeDown = true,
}: BottomSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [translateY, setTranslateY] = useState(0)
  const startY = useRef(0)
  const isDragging = useRef(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible) {
      setIsAnimating(true)
      setTranslateY(0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [visible, onClose])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!closeOnSwipeDown) return
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !closeOnSwipeDown) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0) {
      setTranslateY(diff)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging.current || !closeOnSwipeDown) return
    isDragging.current = false
    if (translateY > 100) {
      onClose()
    } else {
      setTranslateY(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!closeOnSwipeDown) return
    startY.current = e.clientY
    isDragging.current = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const diff = e.clientY - startY.current
      if (diff > 0) {
        setTranslateY(diff)
      }
    }

    const handleMouseUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      if (translateY > 100) {
        onClose()
      } else {
        setTranslateY(0)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleOverlayClick = useCallback(() => {
    if (closeOnOverlayClick) {
      onClose()
    }
  }, [closeOnOverlayClick, onClose])

  if (!visible && !isAnimating) return null

  return (
    <div className="bottom-sheet-container">
      <div 
        className={`bottom-sheet-overlay ${visible ? 'visible' : 'hidden'}`}
        onClick={handleOverlayClick}
      />
      <div
        ref={sheetRef}
        className={`bottom-sheet ${visible ? 'bottom-sheet-visible' : 'bottom-sheet-hidden'}`}
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div className="bottom-sheet-grabber" />

        {(title || subtitle) && (
          <div className="bottom-sheet-header">
            {title && <h3 className="bottom-sheet-title">{title}</h3>}
            {subtitle && <p className="bottom-sheet-subtitle">{subtitle}</p>}
          </div>
        )}

        <div className="bottom-sheet-content">
          {children}

          {actions && actions.length > 0 && (
            <div className="bottom-sheet-actions">
              {actions.map((action) => (
                <button
                  key={action.key}
                  className={`bottom-sheet-action ${action.destructive ? 'destructive' : ''}`}
                  onClick={() => {
                    action.onClick()
                    onClose()
                  }}
                >
                  {action.icon && <span className="bottom-sheet-action-icon">{action.icon}</span>}
                  <span className="bottom-sheet-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {showCancel && (
          <button className="bottom-sheet-cancel" onClick={onClose}>
            {cancelText}
          </button>
        )}
      </div>
    </div>
  )
}

export default BottomSheet