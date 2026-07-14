import { useState, useRef } from 'react'
import {
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Trees,
  FerrisWheel,
  Theater,
  MapPin,
} from 'lucide-react'
import type { Spot } from '../types'

const categoryIconMap: Record<string, React.ElementType> = {
  景点: Landmark,
  美食: UtensilsCrossed,
  购物: ShoppingBag,
  公园: Trees,
  乐园: FerrisWheel,
  文化: Theater,
  其他: MapPin,
}

interface WishCardProps {
  spot: Spot & { tripName?: string }
  tripName?: string
  onRemove?: (spotId: string) => void
  onEditCategory?: (spot: Spot) => void
  onAddToTrip?: (spot: Spot) => void
  onCardClick?: (spot: Spot) => void
  showAddButton?: boolean
  showMenuButton?: boolean
}

function WishCard({
  spot,
  tripName,
  onRemove,
  onEditCategory,
  onAddToTrip,
  onCardClick,
  showAddButton = true,
  showMenuButton = false,
}: WishCardProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)

  const category = spot.category || '其他'
  const IconComponent = categoryIconMap[category] || MapPin

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientX - startX.current
    const newTranslate = Math.max(-80, Math.min(0, diff))
    setTranslateX(newTranslate)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (translateX < -40) {
      setTranslateX(-80)
    } else {
      setTranslateX(0)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX
    setIsDragging(true)
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const diff = e.clientX - startX.current
      const newTranslate = Math.max(-80, Math.min(0, diff))
      setTranslateX(newTranslate)
    }
    const handleMouseUp = () => {
      setIsDragging(false)
      if (translateX < -40) {
        setTranslateX(-80)
      } else {
        setTranslateX(0)
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(spot)
    }
  }

  return (
    <div className="wish-card-wrapper-v2">
      <div className="wish-card-actions-v2">
        {onEditCategory && (
          <button
            className="wish-card-action-v2 wish-card-action-edit"
            onClick={() => onEditCategory(spot)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            <span>编辑</span>
          </button>
        )}
        {onRemove && (
          <button
            className="wish-card-action-v2 wish-card-action-delete"
            onClick={() => onRemove(spot.id)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>删除</span>
          </button>
        )}
      </div>

      <div
        className="wish-card-v2 card"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClick={handleCardClick}
      >
        <div className="wish-card-thumb">
          <div className="wish-card-thumb-placeholder">
            <IconComponent size={24} strokeWidth={1.5} />
          </div>
        </div>

        <div className="wish-card-content">
          <div className="wish-card-top">
            <h3 className="wish-card-title-v2">{spot.name}</h3>
            {showAddButton && onAddToTrip && (
              <button
                className="wish-card-add-btn-v2"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToTrip(spot)
                }}
                title="加入行程"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            )}
            {showMenuButton && (
              <button
                className="wish-card-menu-btn-v2"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            )}
          </div>

          <div className="wish-card-tags">
            <span className="wish-card-type-badge">{category}</span>
          </div>

          <div className="wish-card-location">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{spot.address || spot.destination || '暂无地址'}</span>
          </div>

          {tripName && (
            <div className="wish-card-linked-trip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              <span>{tripName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WishCard