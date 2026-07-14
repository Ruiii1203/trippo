import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useSpotStore } from '../../stores/useSpotStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { useJournalStore } from '../../stores/useJournalStore'
import TripMapPreview from '../../components/TripMapPreview'
import type { Trip, CheckIn } from '../../types'

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
  const startStr = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日`
  const endStr = `${endDate.getMonth() + 1}月${endDate.getDate()}日`
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  return `${startStr} - ${endStr} · ${days}天`
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function getSpotName(spotId: string, spots: Trip['spots']): string {
  return spots.find((s) => s.id === spotId)?.name || '未知景点'
}

function ActionSheet({ trip, onClose, onEdit, onDelete, onShare }: { trip: Trip; onClose: () => void; onEdit: (trip: Trip) => void; onDelete: (trip: Trip) => void; onShare: (trip: Trip) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <>
      <div className="action-sheet-overlay" onClick={onClose} />
      <div className="action-sheet">
        <div className="action-sheet-header">
          <span className="action-sheet-title">{trip.title}</span>
        </div>
        <div className="action-sheet-actions">
          <button className="action-sheet-btn" onClick={() => { onEdit(trip); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            编辑行程
          </button>
          <button className="action-sheet-btn" onClick={() => { onShare(trip); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            分享行程
          </button>
          <button className="action-sheet-btn destructive" onClick={() => { onDelete(trip); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            删除行程
          </button>
        </div>
        <button className="action-sheet-cancel" onClick={onClose}>取消</button>
      </div>
    </>
  )
}

function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { getTripById, loaded: tripLoaded, loadTrips, deleteTrip } = useTripStore()
  const { loaded: spotLoaded, loadSpots, getWishlistedSpots, getSpotsByTrip } = useSpotStore()
  const { loaded: checkInLoaded, loadCheckIns, getCheckInsByTrip } = useCheckInStore()
  const { loaded: journalLoaded, loadJournals, getJournalsByTrip } = useJournalStore()

  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [heroImgError, setHeroImgError] = useState(false)

  useEffect(() => {
    if (!tripLoaded) loadTrips()
    if (!spotLoaded) loadSpots()
    if (!checkInLoaded) loadCheckIns()
    if (!journalLoaded) loadJournals()
  }, [tripLoaded, spotLoaded, checkInLoaded, journalLoaded, loadTrips, loadSpots, loadCheckIns, loadJournals])

  const trip = tripId ? getTripById(tripId) : undefined
  const spots = tripId ? getSpotsByTrip(tripId) : []
  const wishlistCount = tripId ? getWishlistedSpots(tripId).length : 0

  const heroGradient = useMemo(() => trip ? getGradient(trip.destination) : gradientPalettes[0], [trip])

  const getHeroImage = () => {
    if (trip?.coverImage) return trip.coverImage
    const firstSpot = spots.find((s) => s.coverImage)
    if (firstSpot?.coverImage) return firstSpot.coverImage
    return undefined
  }

  const heroImage = getHeroImage()
  const showHeroImg = heroImage && !heroImgError
  const routeSpotsCount = tripId ? spots.filter((s) => s.dayIndex !== undefined).length : 0
  const checkIns = tripId ? getCheckInsByTrip(tripId) : []
  const checkInCount = checkIns.length
  const journals = tripId ? getJournalsByTrip(tripId) : []
  const journalCount = journals.length

  const recentActivities: { type: 'checkin' | 'journal'; data: CheckIn | typeof journals[0]; time: string }[] = []
  
  checkIns.slice(0, 3).forEach((c) => {
    recentActivities.push({ type: 'checkin', data: c, time: c.date })
  })
  
  journals.slice(0, 3).forEach((j) => {
    recentActivities.push({ type: 'journal', data: j, time: j.createdAt })
  })
  
  recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  recentActivities.slice(0, 3)

  if (!trip && tripLoaded) {
    return (
      <div className="page trip-detail-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate('/trips')}>
            ← 返回
          </button>
          <h1 className="page-title">行程详情</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><CircleHelp size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">找不到这个行程</h3>
            <p className="empty-desc">它可能已经被删除了</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate('/trips')}
            >
              返回行程列表
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleShare = (trip: Trip) => {
    const shareText = `我在 Trippo 规划了「${trip.title}」行程，${trip.destination}，${formatDateRange(trip.startDate, trip.endDate)}`
    if (navigator.share) {
      navigator.share({ title: trip.title, text: shareText })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('行程信息已复制到剪贴板')
    }
  }

  const handleDelete = (trip: Trip) => {
    if (confirm(`确定删除行程「${trip.title}」吗？此操作无法撤销。`)) {
      deleteTrip(trip.id)
      navigate('/trips')
    }
  }

  const handleEdit = (trip: Trip) => {
    navigate(`/trips/${trip.id}/edit`)
  }

  const getPrimaryCtaText = () => {
    if (!trip) return '开始打卡'
    if (trip.status === 'ongoing') return '开始打卡'
    if (wishlistCount === 0) return '添加心愿'
    if (routeSpotsCount === 0) return '规划路线'
    return '开始打卡'
  }

  const handlePrimaryCta = () => {
    if (!trip) return
    if (trip.status === 'ongoing') {
      navigate(`/trips/${trip.id}/checkins`)
    } else if (wishlistCount === 0) {
      navigate(`/trips/${trip.id}/spots/search`)
    } else {
      navigate(`/trips/${trip.id}/checkins`)
    }
  }

  return (
    <div className="page trip-detail-page">
      {trip && (
        <>
          <div className="trip-hero-wrapper">
            <div
              className="trip-hero-image"
              onClick={() => showHeroImg && setShowImagePreview(true)}
            >
              {showHeroImg ? (
                <img
                  src={heroImage}
                  alt={trip.destination}
                  className="trip-hero-img"
                  onError={() => setHeroImgError(true)}
                />
              ) : (
                <div className="trip-hero-placeholder" style={{ background: heroGradient }}>
                  <span className="trip-hero-placeholder-text">{trip.destination.charAt(0)}</span>
                </div>
              )}
              <button
                className="trip-hero-edit-cover-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(trip)
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                更换封面
              </button>
            </div>
            
            <div className="trip-hero-overlay">
              <button className="trip-hero-back" onClick={() => navigate(-1)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              
              <div className="trip-hero-actions">
                <button className="trip-hero-action" onClick={() => handleShare(trip)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
                <button className="trip-hero-action" onClick={() => setShowActionSheet(true)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="page-content">
            <div className="trip-info">
              <div className="trip-info-header">
                <h1 className="trip-title-lg">{trip.title}</h1>
                {trip.status === 'ongoing' && (
                  <span className="trip-status-ongoing-badge">进行中</span>
                )}
              </div>
              <p className="trip-destination-lg">{trip.destination}</p>
              <p className="trip-date-lg">{formatDateRange(trip.startDate, trip.endDate)}</p>
            </div>

            <div className="quick-entry-grid">
              <Link to={`/trips/${trip.id}/spots/wishlist`} className="quick-entry-card card">
                <div className="quick-entry-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <span className="quick-entry-label">心愿单</span>
              </Link>

              <Link to={`/trips/${trip.id}/route`} className="quick-entry-card card">
                <div className="quick-entry-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  </svg>
                </div>
                <span className="quick-entry-label">每日路线</span>
              </Link>

              <Link to={`/trips/${trip.id}/checkins`} className="quick-entry-card card">
                <div className="quick-entry-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span className="quick-entry-label">打卡</span>
              </Link>

              <Link to={`/trips/${trip.id}/journals`} className="quick-entry-card card">
                <div className="quick-entry-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                </div>
                <span className="quick-entry-label">手账</span>
              </Link>
            </div>

            <div className="trip-stats">
              <div className="trip-stat-item">
                <div className="trip-stat-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <span className="trip-stat-value">{wishlistCount}</span>
                <span className="trip-stat-label">心愿</span>
              </div>
              
              <div className="trip-stat-divider" />
              
              <div className="trip-stat-item">
                <div className="trip-stat-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span className="trip-stat-value">{checkInCount}</span>
                <span className="trip-stat-label">打卡</span>
              </div>
              
              <div className="trip-stat-divider" />
              
              <div className="trip-stat-item">
                <div className="trip-stat-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                  </svg>
                </div>
                <span className="trip-stat-value">{journalCount}</span>
                <span className="trip-stat-label">手账</span>
              </div>
            </div>

            <TripMapPreview spots={spots} height={240} />

            <div className="recent-activity">
              <div className="section-header">
                <h2 className="section-title">最近动态</h2>
              </div>
              
              {recentActivities.length === 0 ? (
                <div className="section-empty">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>暂无活动记录</span>
                </div>
              ) : (
                <div className="activity-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item card">
                      <div className="activity-icon">
                        {activity.type === 'checkin' && (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                        {activity.type === 'journal' && (
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <path d="M14 2v6h6" />
                          </svg>
                        )}
                      </div>
                      <div className="activity-content">
                        <span className="activity-text">
                          {activity.type === 'checkin' 
                            ? `打卡了 ${getSpotName((activity.data as CheckIn).spotId, spots)}`
                            : `更新了手账 ${(activity.data as typeof journals[0]).title}`
                          }
                        </span>
                        <span className="activity-time">{formatDateShort(activity.time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="trip-detail-footer">
              <button className="btn btn-primary btn-block" onClick={handlePrimaryCta}>
                {getPrimaryCtaText()}
              </button>
            </div>
          </div>
        </>
      )}

      {showActionSheet && trip && (
        <ActionSheet
          trip={trip}
          onClose={() => setShowActionSheet(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      )}

      {showImagePreview && (
        <div className="image-preview-overlay" onClick={() => setShowImagePreview(false)}>
          <div className="image-preview-content">
            {showHeroImg ? (
              <img
                src={heroImage}
                alt=""
                className="image-preview-img"
                onError={() => setHeroImgError(true)}
              />
            ) : (
              <div className="trip-hero-placeholder" style={{ width: '200px', height: '200px', background: heroGradient }}>
                <span className="trip-hero-placeholder-text">{trip?.destination.charAt(0) || ''}</span>
              </div>
            )}
            <span className="image-preview-hint">点击关闭预览</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetailPage