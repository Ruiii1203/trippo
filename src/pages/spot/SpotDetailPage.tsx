import { useParams, useNavigate } from 'react-router-dom'
import {
  Building2,
  Car,
  Drama,
  FerrisWheel,
  HelpCircle,
  Hotel,
  MapPin,
  ShoppingBag,
  Sparkles,
  Trees,
  Umbrella,
  UtensilsCrossed,
} from 'lucide-react'
import { useSpotStore } from '../../stores/useSpotStore'
import { useTripStore } from '../../stores/useTripStore'
import type { Spot } from '../../types'

const categoryConfig: Record<string, { icon: React.ElementType; label: string; fields: string[] }> = {
  景点: { icon: Building2, label: '景点', fields: ['rating', 'address', 'openingHours', 'ticketPrice', 'description'] },
  美食: { icon: UtensilsCrossed, label: '美食', fields: ['rating', 'address', 'priceRange', 'cuisine', 'recommendDish', 'description'] },
  购物: { icon: ShoppingBag, label: '购物', fields: ['address', 'priceRange', 'brand', 'description'] },
  公园: { icon: Trees, label: '公园', fields: ['rating', 'address', 'openingHours', 'ticketPrice', 'description'] },
  乐园: { icon: FerrisWheel, label: '乐园', fields: ['rating', 'address', 'openingHours', 'ticketPrice', 'description'] },
  文化: { icon: Drama, label: '文化', fields: ['rating', 'address', 'openingHours', 'ticketPrice', 'description'] },
  度假: { icon: Umbrella, label: '度假', fields: ['rating', 'address', 'priceRange', 'facility', 'description'] },
  体验: { icon: Sparkles, label: '体验', fields: ['rating', 'address', 'priceRange', 'duration', 'description'] },
  交通: { icon: Car, label: '交通', fields: ['address', 'priceRange', 'description'] },
  住宿: { icon: Hotel, label: '住宿', fields: ['rating', 'address', 'priceRange', 'facility', 'checkInTime', 'checkOutTime', 'description'] },
  其他: { icon: MapPin, label: '其他', fields: ['rating', 'address', 'description'] },
}

interface ExtendedSpot extends Spot {
  openingHours?: string
  ticketPrice?: string
  priceRange?: string
  cuisine?: string
  recommendDish?: string
  brand?: string
  facility?: string
  duration?: string
  checkInTime?: string
  checkOutTime?: string
}

function SpotDetailPage() {
  const { spotId } = useParams<{ spotId: string; tripId?: string }>()
  const navigate = useNavigate()
  const { spots } = useSpotStore()
  const { trips } = useTripStore()

  const spot = spots.find((s) => s.id === spotId) as ExtendedSpot | undefined
  const trip = trips.find((t) => t.id === spot?.tripId)

  const category = spot?.category || '其他'
  const config = categoryConfig[category] || categoryConfig['其他']

  if (!spot) {
    return (
      <div className="page spot-detail-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← 返回</button>
          <h1 className="page-title">心愿详情</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><HelpCircle size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">心愿不存在</h3>
            <button className="btn btn-primary btn-block" onClick={() => navigate(-1)}>返回</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page spot-detail-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>← 返回</button>
        <h1 className="page-title">心愿详情</h1>
        <div style={{ width: 48 }} />
      </header>

      <div className="page-content">
        <div className="spot-detail-header">
          <div className="spot-detail-cover">
            {spot.coverImage ? (
              <img src={spot.coverImage} alt={spot.name} className="spot-detail-cover-img" />
            ) : (
              <div className="spot-detail-cover-placeholder">
                <span className="spot-detail-cover-icon"><config.icon size={48} strokeWidth={1.5} /></span>
              </div>
            )}
          </div>
          <div className="spot-detail-info">
            <div className="spot-detail-category">
              <span className="spot-detail-category-icon"><config.icon size={20} strokeWidth={1.5} /></span>
              <span className="spot-detail-category-label">{config.label}</span>
            </div>
            <h1 className="spot-detail-title">{spot.name}</h1>
            {spot.rating && (
              <div className="spot-detail-rating">
                <span className="spot-detail-rating-star">★</span>
                <span className="spot-detail-rating-value">{spot.rating}</span>
              </div>
            )}
          </div>
        </div>

        {spot.address && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>位置</span>
            </div>
            <p className="spot-detail-text">{spot.address}</p>
          </div>
        )}

        {(category === '美食' || category === '购物' || category === '度假' || category === '住宿') && spot.priceRange && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>价格</span>
            </div>
            <p className="spot-detail-text">{spot.priceRange}</p>
          </div>
        )}

        {(category === '景点' || category === '公园' || category === '乐园' || category === '文化') && spot.openingHours && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>开放时间</span>
            </div>
            <p className="spot-detail-text">{spot.openingHours}</p>
          </div>
        )}

        {(category === '景点' || category === '公园' || category === '乐园' || category === '文化') && spot.ticketPrice && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <span>门票价格</span>
            </div>
            <p className="spot-detail-text">{spot.ticketPrice}</p>
          </div>
        )}

        {category === '美食' && spot.cuisine && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>🍳</span>
              <span>菜系</span>
            </div>
            <p className="spot-detail-text">{spot.cuisine}</p>
          </div>
        )}

        {category === '美食' && spot.recommendDish && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>⭐</span>
              <span>推荐菜品</span>
            </div>
            <p className="spot-detail-text">{spot.recommendDish}</p>
          </div>
        )}

        {category === '购物' && spot.brand && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>🏷️</span>
              <span>品牌</span>
            </div>
            <p className="spot-detail-text">{spot.brand}</p>
          </div>
        )}

        {(category === '度假' || category === '住宿') && spot.facility && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>🏠</span>
              <span>设施服务</span>
            </div>
            <p className="spot-detail-text">{spot.facility}</p>
          </div>
        )}

        {category === '体验' && spot.duration && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>⏱️</span>
              <span>体验时长</span>
            </div>
            <p className="spot-detail-text">{spot.duration}</p>
          </div>
        )}

        {category === '住宿' && spot.checkInTime && spot.checkOutTime && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>⏰</span>
              <span>入住离店</span>
            </div>
            <p className="spot-detail-text">入住：{spot.checkInTime} | 离店：{spot.checkOutTime}</p>
          </div>
        )}

        {trip && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>所属行程</span>
            </div>
            <button className="spot-detail-trip-link" onClick={() => navigate(`/trips/${trip.id}`)}>
              {trip.title}
            </button>
          </div>
        )}

        {spot.lat && spot.lng && (
          <div className="spot-detail-section">
            <div className="spot-detail-section-header">
              <span>🗺️</span>
              <span>坐标</span>
            </div>
            <p className="spot-detail-text">{spot.lat}, {spot.lng}</p>
          </div>
        )}

        <div className="spot-detail-actions">
          <button className="btn btn-primary btn-block" onClick={() => navigate(`/trips/${spot.tripId}/spots/wishlist`)}>
            返回心愿单
          </button>
        </div>
      </div>
    </div>
  )
}

export default SpotDetailPage