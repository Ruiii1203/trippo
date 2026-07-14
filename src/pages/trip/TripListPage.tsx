import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Luggage } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useSpotStore } from '../../stores/useSpotStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { useJournalStore } from '../../stores/useJournalStore'
import TripCard from '../../components/TripCard'
import BottomSheet from '../../components/BottomSheet'
import type { Trip } from '../../types'

function TripSection({ title, trips, count, onMenuClick, getMetrics, getCoverImage }: { title: string; trips: Trip[]; count: number; onMenuClick: (e: React.MouseEvent, trip: Trip) => void; getMetrics: (tripId: string) => { wishlistCount: number; checkInCount: number; journalCount: number }; getCoverImage: (trip: Trip) => string | undefined }) {
  return (
    <div className="trip-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <span className="section-count">{count}</span>
      </div>
      
      {trips.length === 0 ? (
        <div className="section-empty">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>暂无行程</span>
        </div>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => {
            const metrics = getMetrics(trip.id)
            const coverImage = getCoverImage(trip)
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                wishlistCount={metrics.wishlistCount}
                checkInCount={metrics.checkInCount}
                journalCount={metrics.journalCount}
                coverImage={coverImage}
                onMenuClick={onMenuClick}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="trip-card card skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-title" />
        <div className="skeleton-badge" />
      </div>
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  )
}

function SkeletonSection() {
  return (
    <div className="trip-section">
      <div className="section-header">
        <div className="skeleton-title-text" />
        <div className="skeleton-count" />
      </div>
      <div className="trip-list">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

function ActionSheet({ trip, onClose, onEdit, onDelete, onShare, onStatusChange }: { trip: Trip; onClose: () => void; onEdit: (trip: Trip) => void; onDelete: (trip: Trip) => void; onShare: (trip: Trip) => void; onStatusChange?: (status: Trip['status']) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const statusOptions = [
    { value: 'upcoming', label: '计划中', disabled: trip.status === 'upcoming' },
    { value: 'ongoing', label: '进行中', disabled: trip.status === 'ongoing' },
    { value: 'completed', label: '已完成', disabled: trip.status === 'completed' },
  ]

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
            编辑
          </button>
          <button className="action-sheet-btn" onClick={() => { onShare(trip); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            分享
          </button>
          {onStatusChange && (
            <div className="action-sheet-section">
              <span className="action-sheet-section-title">状态</span>
              <div className="action-sheet-status-options">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`action-sheet-status-option ${opt.disabled ? 'active' : ''}`}
                    onClick={() => { if (!opt.disabled) onStatusChange(opt.value as Trip['status']); onClose(); }}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button className="action-sheet-btn destructive" onClick={() => { onDelete(trip); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            删除
          </button>
        </div>
        <button className="action-sheet-cancel" onClick={onClose}>取消</button>
      </div>
    </>
  )
}

function TripListPage() {
  const navigate = useNavigate()
  const { trips, loaded, loadTrips, deleteTrip, updateTrip } = useTripStore()
  const { loaded: spotLoaded, loadSpots, getWishlistedSpots, getSpotsByTrip } = useSpotStore()
  const { loaded: checkInLoaded, loadCheckIns, getCheckInsByTrip } = useCheckInStore()
  const { loaded: journalLoaded, loadJournals, getJournalsByTrip } = useJournalStore()
  
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [showFilterSheet, setShowFilterSheet] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'upcoming' | 'completed'>('all')
  
  const contentRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const isDragging = useRef(false)

  useEffect(() => {
    if (!loaded) loadTrips()
    if (!spotLoaded) loadSpots()
    if (!checkInLoaded) loadCheckIns()
    if (!journalLoaded) loadJournals()
  }, [loaded, spotLoaded, checkInLoaded, journalLoaded, loadTrips, loadSpots, loadCheckIns, loadJournals])

  const getMetrics = (tripId: string) => ({
    wishlistCount: getWishlistedSpots(tripId).length,
    checkInCount: getCheckInsByTrip(tripId).length,
    journalCount: getJournalsByTrip(tripId).length,
  })

  const getCoverImage = (trip: Trip) => {
    if (trip.coverImage) return trip.coverImage
    const spots = getSpotsByTrip(trip.id)
    const firstSpot = spots.find((s) => s.coverImage)
    if (firstSpot?.coverImage) return firstSpot.coverImage
    return undefined
  }

  const filteredTrips = trips.filter((t) => {
    if (filterStatus === 'all') return true
    return t.status === filterStatus
  })

  const ongoingTrips = filteredTrips.filter((t) => t.status === 'ongoing')
  const upcomingTrips = filteredTrips.filter((t) => t.status === 'upcoming')
  const completedTrips = filteredTrips.filter((t) => t.status === 'completed')

  const handleRefresh = () => {
    if (refreshing) return
    setRefreshing(true)
    setTimeout(() => {
      loadTrips()
      setRefreshing(false)
    }, 800)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY
      isDragging.current = true
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const diff = e.touches[0].clientY - startY.current
    if (diff > 0 && contentRef.current && contentRef.current.scrollTop === 0) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const diff = e.changedTouches[0].clientY - startY.current
    if (diff > 60 && contentRef.current && contentRef.current.scrollTop === 0) {
      handleRefresh()
    }
  }

  const handleMenuClick = (e: React.MouseEvent, trip: Trip) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedTrip(trip)
    setShowActionSheet(true)
  }

  const handleEdit = (trip: Trip) => {
    navigate(`/trips/${trip.id}/edit`)
  }

  const handleDelete = (trip: Trip) => {
    if (confirm(`确定删除行程「${trip.title}」吗？`)) {
      deleteTrip(trip.id)
    }
  }

  const handleShare = (trip: Trip) => {
    const shareText = `我在 Trippo 规划了「${trip.title}」行程，${trip.destination}，${formatDateRange(trip.startDate, trip.endDate)}`
    if (navigator.share) {
      navigator.share({
        title: trip.title,
        text: shareText,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('行程信息已复制到剪贴板')
    }
  }

  return (
    <div className="page trip-list-page">
      <header className="page-header">
        <h1 className="page-title">我的行程</h1>
        <div className="page-header-actions">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setShowFilterSheet(true)}
            aria-label="筛选"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/trips/create')}
          >
            + 新建
          </button>
        </div>
      </header>

      <div
        className="page-content"
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {refreshing && (
          <div className="refresh-indicator">
            <div className="refresh-spinner" />
            <span className="refresh-text">刷新中...</span>
          </div>
        )}

        {!loaded ? (
          <>
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </>
        ) : trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Luggage size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">还没有行程</h3>
            <p className="empty-desc">创建你的第一个旅行行程吧</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate('/trips/create')}
            >
              创建行程
            </button>
          </div>
        ) : (
          <>
            {ongoingTrips.length > 0 || upcomingTrips.length > 0 || completedTrips.length > 0 ? (
              <>
                {ongoingTrips.length > 0 && (
                  <TripSection
                    title="进行中"
                    trips={ongoingTrips}
                    count={ongoingTrips.length}
                    onMenuClick={handleMenuClick}
                    getMetrics={getMetrics}
                    getCoverImage={getCoverImage}
                  />
                )}
                {upcomingTrips.length > 0 && (
                  <TripSection
                    title="计划中"
                    trips={upcomingTrips}
                    count={upcomingTrips.length}
                    onMenuClick={handleMenuClick}
                    getMetrics={getMetrics}
                    getCoverImage={getCoverImage}
                  />
                )}
                {completedTrips.length > 0 && (
                  <TripSection
                    title="已完成"
                    trips={completedTrips}
                    count={completedTrips.length}
                    onMenuClick={handleMenuClick}
                    getMetrics={getMetrics}
                    getCoverImage={getCoverImage}
                  />
                )}
              </>
            ) : null}
          </>
        )}
      </div>

      {showActionSheet && selectedTrip && (
        <ActionSheet
          trip={selectedTrip}
          onClose={() => setShowActionSheet(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShare={handleShare}
          onStatusChange={(status) => {
            updateTrip(selectedTrip.id, { status })
            setShowActionSheet(false)
          }}
        />
      )}

      {showFilterSheet && (
        <BottomSheet
          visible={showFilterSheet}
          onClose={() => setShowFilterSheet(false)}
          title="筛选行程"
          showCancel={true}
          cancelText="取消"
        >
          <div className="filter-list">
            <button
              className={`filter-item ${filterStatus === 'all' ? 'selected' : ''}`}
              onClick={() => { setFilterStatus('all'); setShowFilterSheet(false) }}
            >
              <span className="filter-label">全部</span>
              <span className="filter-count">{trips.length}</span>
              {filterStatus === 'all' && (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <button
              className={`filter-item ${filterStatus === 'ongoing' ? 'selected' : ''}`}
              onClick={() => { setFilterStatus('ongoing'); setShowFilterSheet(false) }}
            >
              <span className="filter-label">进行中</span>
              <span className="filter-count">{trips.filter(t => t.status === 'ongoing').length}</span>
              {filterStatus === 'ongoing' && (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <button
              className={`filter-item ${filterStatus === 'upcoming' ? 'selected' : ''}`}
              onClick={() => { setFilterStatus('upcoming'); setShowFilterSheet(false) }}
            >
              <span className="filter-label">计划中</span>
              <span className="filter-count">{trips.filter(t => t.status === 'upcoming').length}</span>
              {filterStatus === 'upcoming' && (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <button
              className={`filter-item ${filterStatus === 'completed' ? 'selected' : ''}`}
              onClick={() => { setFilterStatus('completed'); setShowFilterSheet(false) }}
            >
              <span className="filter-label">已完成</span>
              <span className="filter-count">{trips.filter(t => t.status === 'completed').length}</span>
              {filterStatus === 'completed' && (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          </div>
        </BottomSheet>
      )}

      <div className="trip-fab-wrapper">
        <button
          className="trip-fab"
          onClick={() => navigate('/trips/create')}
          aria-label="新建行程"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TripListPage