import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Trip } from '../types'

const gradientPalettes = [
  'linear-gradient(135deg, #FF7A45 0%, #FFB088 100%)',
  'linear-gradient(135deg, #FF9A56 0%, #FFD4A3 100%)',
  'linear-gradient(135deg, #FF6B6B 0%, #FFA8A8 100%)',
  'linear-gradient(135deg, #E67E22 0%, #F5C77E 100%)',
  'linear-gradient(135deg, #D35400 0%, #F39C12 100%)',
]

function getGradient(destination: string): string {
  let hash = 0
  for (let i = 0; i < destination.length; i++) {
    hash = destination.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradientPalettes.length
  return gradientPalettes[index]
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startStr = `${startDate.getMonth() + 1}月${startDate.getDate()}日`
  const endStr = `${endDate.getMonth() + 1}月${endDate.getDate()}日`
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${startStr} - ${endStr} · ${days}天`
}

function getStatusText(status: Trip['status']): string {
  switch (status) {
    case 'upcoming':
      return '计划中'
    case 'ongoing':
      return '进行中'
    case 'completed':
      return '已完成'
    default:
      return ''
  }
}

function getDestinationInitial(destination: string): string {
  return destination.charAt(0)
}

interface TripCardProps {
  trip: Trip
  wishlistCount?: number
  checkInCount?: number
  journalCount?: number
  coverImage?: string
  onMenuClick?: (e: React.MouseEvent, trip: Trip) => void
}

function TripCard({ trip, wishlistCount = 0, checkInCount = 0, journalCount = 0, coverImage, onMenuClick }: TripCardProps) {
  const isOngoing = trip.status === 'ongoing'
  const isCompleted = trip.status === 'completed'
  const [imgError, setImgError] = useState(false)
  const showCover = coverImage && !imgError
  const gradient = getGradient(trip.destination)

  return (
    <div className={`trip-card-v2 ${isOngoing ? 'trip-card-ongoing' : ''}`}>
      <Link to={`/trips/${trip.id}`} className="trip-card-link">
        <div className="trip-card-cover">
          {showCover ? (
            <img
              src={coverImage}
              alt={trip.destination}
              className="trip-card-cover-image"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="trip-card-cover-placeholder" style={{ background: gradient }}>
              <span className="trip-card-cover-initial">{getDestinationInitial(trip.destination)}</span>
            </div>
          )}
          <span className={`trip-card-badge trip-card-badge-${trip.status}`}>
            {getStatusText(trip.status)}
          </span>
        </div>

        <div className="trip-card-content">
          <h3 className="trip-card-title">{trip.title}</h3>
          
          <div className="trip-card-sub">
            <span className="trip-card-dest">{trip.destination}</span>
            <span className="trip-card-dot">·</span>
            <span className="trip-card-date">{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>

          <div className="trip-card-metrics">
            <div className="trip-card-metric">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{wishlistCount}</span>
            </div>
            <div className="trip-card-metric">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>{checkInCount}</span>
            </div>
            <div className="trip-card-metric">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
              </svg>
              <span>{journalCount}</span>
            </div>
          </div>
        </div>
      </Link>

      {onMenuClick && (
        <button
          className="trip-card-menu-btn"
          onClick={(e) => onMenuClick(e, trip)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default TripCard