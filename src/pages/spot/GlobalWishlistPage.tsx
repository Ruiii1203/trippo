import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Trees,
  FerrisWheel,
  Theater,
  MapPin,
  Globe,
  Sparkles,
} from 'lucide-react'
import { useSpotStore } from '../../stores/useSpotStore'
import { useTripStore } from '../../stores/useTripStore'
import BottomSheet from '../../components/BottomSheet'
import { useToast } from '../../components/Toast'
import { generateAIRoute, isArkConfigured } from '../../api/aiPlanner'
import type { Spot } from '../../types'

const categories = [
  { id: 'all', label: '全部' },
  { id: '景点', label: '景点' },
  { id: '美食', label: '美食' },
  { id: '旅行地', label: '旅行地' },
  { id: '清单', label: '清单' },
]

const categoryIconMap: Record<string, React.ElementType> = {
  景点: Landmark,
  美食: UtensilsCrossed,
  购物: ShoppingBag,
  公园: Trees,
  乐园: FerrisWheel,
  文化: Theater,
  其他: MapPin,
}

function WishCard({ spot, tripName, onRemove, onEditCategory, onAddToTrip, onCardClick }: { spot: Spot & { tripName?: string }; tripName?: string; onRemove: (spotId: string) => void; onEditCategory: (spot: Spot) => void; onAddToTrip: (spot: Spot) => void; onCardClick: (spot: Spot) => void }) {
  const [translateX, setTranslateX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="wish-card-wrapper">
      <div className="wish-card-actions">
        <button className="wish-card-action wish-card-edit" onClick={() => onEditCategory(spot)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          <span>编辑</span>
        </button>
        <button className="wish-card-action wish-card-delete" onClick={() => onRemove(spot.id)}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span>删除</span>
        </button>
      </div>
      <div
        ref={cardRef}
        className="wish-card card"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onClick={() => onCardClick(spot)}
      >
        <div className="wish-card-left">
          <div className="wish-card-icon">
            {(() => {
              const IconComp = categoryIconMap[spot.category || '其他'] || MapPin
              return <IconComp size={20} strokeWidth={1.5} />
            })()}
          </div>
          <div className="wish-card-info">
            <div className="wish-card-name">
              {spot.name}
              {spot.category && (
                <span className="wish-card-category">{spot.category}</span>
              )}
            </div>
            <div className="wish-card-address">{spot.address}</div>
            {spot.rating && (
              <div className="wish-card-rating">★ {spot.rating}</div>
            )}
            {tripName && (
              <div className="wish-card-trip">属于：{tripName}</div>
            )}
          </div>
        </div>
        <button
          className="wish-card-add-btn"
          onClick={(e) => { e.stopPropagation(); onAddToTrip(spot) }}
          title="加入行程"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function SkeletonWishCard() {
  return (
    <div className="wish-card-wrapper">
      <div className="wish-card card skeleton-wish-card">
        <div className="wish-card-left">
          <div className="skeleton-icon" />
          <div className="skeleton-info">
            <div className="skeleton-name" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
        <div className="skeleton-add-btn" />
      </div>
    </div>
  )
}

function CategorySelector({ activeCategory, onSelect }: { activeCategory: string; onSelect: (category: string) => void }) {
  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

function GlobalWishlistPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { loaded: spotsLoaded, loadSpots, getWishlistedSpots, toggleWishlist, updateSpotCategory, moveSpotToTrip, applyAIRoute } = useSpotStore()
  const { loaded: tripLoaded, loadTrips, trips, getTripById, setAIRouteDraft } = useTripStore()

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showTripSelector, setShowTripSelector] = useState(false)
  const [showAITripSelector, setShowAITripSelector] = useState(false)
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null)
  const [addingSpot, setAddingSpot] = useState<Spot | null>(null)
  const [fadeKey, setFadeKey] = useState(0)
  const [isAIPlanning, setIsAIPlanning] = useState(false)

  useEffect(() => {
    if (!spotsLoaded) loadSpots()
    if (!tripLoaded) loadTrips()
  }, [spotsLoaded, tripLoaded, loadSpots, loadTrips])

  useEffect(() => {
    setFadeKey((prev) => prev + 1)
  }, [activeCategory, searchQuery])

  const allWishlistedSpots = trips.flatMap((trip) =>
    getWishlistedSpots(trip.id).map((spot) => ({ ...spot, tripId: trip.id, tripName: trip.name }))
  )

  const filteredSpots = allWishlistedSpots.filter((spot) => {
    if (activeCategory !== 'all' && spot.category !== activeCategory) {
      if (activeCategory === '旅行地' && spot.category === '景点') return true
      if (activeCategory === '清单') return false
      return false
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = spot.name.toLowerCase().includes(query)
      const matchesAddress = spot.address ? spot.address.toLowerCase().includes(query) : false
      if (!matchesName && !matchesAddress) {
        return false
      }
    }
    return true
  })

  const handleRemove = (spotId: string) => {
    toggleWishlist(spotId)
  }

  const handleEditCategory = (spot: Spot) => {
    setEditingSpot(spot)
    setShowCategoryModal(true)
  }

  const handleAddToTrip = (spot: Spot) => {
    if (trips.length === 0) {
      navigate('/trips/create')
      return
    }
    setAddingSpot(spot)
    setShowTripSelector(true)
  }

  const handleSelectTrip = (tripId: string, tripName: string) => {
    if (addingSpot) {
      moveSpotToTrip(addingSpot.id, tripId)
      toast.success(`已添加到「${tripName}」`)
    }
    setShowTripSelector(false)
    setAddingSpot(null)
  }

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category)
  }

  const handleConfirmCategory = () => {
    if (editingSpot && activeCategory !== 'all' && activeCategory !== '旅行地' && activeCategory !== '清单') {
      updateSpotCategory(editingSpot.id, activeCategory)
    }
    setShowCategoryModal(false)
    setEditingSpot(null)
  }

  const handleAIPlanClick = () => {
    if (filteredSpots.length === 0) {
      toast.info('先添加一些心愿，再让 AI 帮你安排吧')
      return
    }
    if (trips.length === 0) {
      toast.info('先创建一个行程，再让 AI 帮你安排吧')
      return
    }
    setShowAITripSelector(true)
  }

  const handleSelectTripForAI = async (tripId: string) => {
    setShowAITripSelector(false)
    const trip = getTripById(tripId)
    if (!trip) {
      toast.error('行程不存在')
      return
    }
    const tripSpots = filteredSpots.filter((s) => s.tripId === tripId)
    if (tripSpots.length === 0) {
      toast.warning('该行程下还没有心愿景点')
      return
    }
    if (tripSpots.length < 3) {
      toast.warning('建议至少添加 3 个心愿，AI 安排会更合理')
    }
    if (!isArkConfigured()) {
      toast.warning('请先配置火山方舟 API Key')
      return
    }

    setIsAIPlanning(true)
    try {
      const totalDays = Math.ceil(
        (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
      ) + 1
      const result = await generateAIRoute(trip, tripSpots, totalDays)
      applyAIRoute(tripId, result.days)
      setAIRouteDraft(tripId, 'draft')
      toast.success('AI 已生成每日路线草稿')
      setTimeout(() => {
        navigate(`/trips/${tripId}/route`)
      }, 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 生成失败，请稍后再试'
      toast.error(message)
    } finally {
      setIsAIPlanning(false)
    }
  }

  if (!spotsLoaded || !tripLoaded) {
    return (
      <div className="page wishlist-page">
        <header className="page-header">
          <h1 className="page-title">心愿单</h1>
        </header>
        <div className="page-content">
          <CategorySelector activeCategory="all" onSelect={() => {}} />
          <div className="search-bar-wrap">
            <div className="search-bar">
              <span className="search-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="search-input"
                placeholder="搜索心愿..."
                value=""
                disabled
              />
            </div>
          </div>
          <div className="wishlist-skeleton">
            <SkeletonWishCard />
            <SkeletonWishCard />
            <SkeletonWishCard />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page wishlist-page">
      <header className="page-header">
        <h1 className="page-title">心愿单</h1>
      </header>

      <div className="page-content">
        <CategorySelector activeCategory={activeCategory} onSelect={handleSelectCategory} />

        <div className="search-bar-wrap">
          <div className="search-bar">
            <span className="search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="search-input"
              placeholder="搜索心愿..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="wishlist-summary">
          <p className="wishlist-count">
            共 <strong>{filteredSpots.length}</strong> 个心愿
          </p>
          {filteredSpots.length > 0 && trips.length > 0 && (
            <button
              className="btn btn-ai-plan btn-sm"
              onClick={handleAIPlanClick}
              disabled={isAIPlanning}
            >
              <Sparkles size={16} strokeWidth={1.5} />
              {isAIPlanning ? '安排中' : 'AI 安排'}
            </button>
          )}
        </div>

        <div key={fadeKey} className="wishlist-list">
          {filteredSpots.length === 0 ? (
            <div className="empty-state-compact">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="empty-compact-text">还没有{activeCategory === 'all' ? '' : activeCategory}心愿</span>
              {trips.length > 0 && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/trips/${trips[0].id}/spots/search`)}
                >
                  添加心愿
                </button>
              )}
            </div>
          ) : (
            filteredSpots.map((spot) => (
              <WishCard
                key={spot.id}
                spot={spot}
                tripName={spot.tripName}
                onRemove={handleRemove}
                onEditCategory={handleEditCategory}
                onAddToTrip={handleAddToTrip}
                onCardClick={(spot) => navigate(`/wishlist/${spot.id}`)}
              />
            ))
          )}
        </div>

        {trips.length === 0 && filteredSpots.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Globe size={48} strokeWidth={1.5} />
            </div>
            <h3 className="empty-title">还没有行程</h3>
            <p className="empty-desc">先创建一个行程，才能添加心愿景点</p>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/trips/create')}>
              创建行程
            </button>
          </div>
        )}
      </div>

      {trips.length > 0 && filteredSpots.length > 0 && (
        <div className="wishlist-fab-wrapper">
          <button
            className="wishlist-fab"
            onClick={() => navigate(`/trips/${trips[0].id}/spots/search`)}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      )}

      {showTripSelector && (
        <BottomSheet
          visible={showTripSelector}
          onClose={() => {
            setShowTripSelector(false)
            setAddingSpot(null)
          }}
          title="选择行程"
          subtitle={addingSpot?.name}
          showCancel={true}
          cancelText="取消"
        >
          <div className="trip-selector-list">
            {trips.map((trip) => (
              <button
                key={trip.id}
                className={`trip-selector-item ${addingSpot?.tripId === trip.id ? 'selected' : ''}`}
                onClick={() => handleSelectTrip(trip.id, trip.name)}
              >
                <div className="trip-selector-info">
                  <div className="trip-selector-name">{trip.name}</div>
                  <div className="trip-selector-date">{trip.startDate} - {trip.endDate}</div>
                </div>
                {addingSpot?.tripId === trip.id && (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {showAITripSelector && (
        <BottomSheet
          visible={showAITripSelector}
          onClose={() => setShowAITripSelector(false)}
          title="选择目标行程"
          subtitle="AI 将为该行程安排心愿景点"
          showCancel={true}
          cancelText="取消"
        >
          <div className="trip-selector-list">
            {trips.map((trip) => {
              const tripSpotCount = filteredSpots.filter((s) => s.tripId === trip.id).length
              return (
                <button
                  key={trip.id}
                  className="trip-selector-item"
                  onClick={() => handleSelectTripForAI(trip.id)}
                  disabled={isAIPlanning}
                >
                  <div className="trip-selector-info">
                    <div className="trip-selector-name">{trip.name}</div>
                    <div className="trip-selector-date">{trip.startDate} - {trip.endDate}</div>
                  </div>
                  <div className="trip-selector-count">
                    {tripSpotCount} 个心愿
                  </div>
                </button>
              )
            })}
          </div>
        </BottomSheet>
      )}

      {showCategoryModal && editingSpot && (
        <>
          <div className="modal-overlay" onClick={() => setShowCategoryModal(false)} />
          <div className="category-modal">
            <div className="modal-header">
              <span className="modal-title">编辑分类</span>
              <button className="modal-close" onClick={() => setShowCategoryModal(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="category-grid">
              {categories.filter((c) => c.id !== 'all' && c.id !== '旅行地' && c.id !== '清单').map((cat) => (
                <button
                  key={cat.id}
                  className={`category-option ${editingSpot.category === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-block" onClick={() => setShowCategoryModal(false)}>
                取消
              </button>
              <button className="btn btn-primary btn-block" onClick={handleConfirmCategory}>
                确定
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default GlobalWishlistPage