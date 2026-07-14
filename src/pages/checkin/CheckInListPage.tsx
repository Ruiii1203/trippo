import { useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Camera, CircleHelp } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useSpotStore } from '../../stores/useSpotStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { checkInCategoryConfig } from '../../data/mockLists'
import type { CheckInCategory } from '../../types'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function CheckInListPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { getTripById, loaded: tripLoaded, loadTrips } = useTripStore()
  const { getSpotsByTrip, loaded: spotLoaded, loadSpots } = useSpotStore()
  const { getCheckInsByTrip, loaded: checkInLoaded, loadCheckIns } = useCheckInStore()

  useEffect(() => {
    if (!tripLoaded) loadTrips()
    if (!spotLoaded) loadSpots()
    if (!checkInLoaded) loadCheckIns()
  }, [tripLoaded, spotLoaded, checkInLoaded, loadTrips, loadSpots, loadCheckIns])

  const trip = tripId ? getTripById(tripId) : undefined
  const checkIns = tripId ? getCheckInsByTrip(tripId) : []
  const spots = tripId ? getSpotsByTrip(tripId) : []

  const checkInsWithSpot = useMemo(() => {
    return checkIns.map((c) => ({
      ...c,
      spot: spots.find((s) => s.id === c.spotId),
    }))
  }, [checkIns, spots])

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof checkInsWithSpot> = {}
    for (const c of checkInsWithSpot) {
      if (!groups[c.date]) groups[c.date] = []
      groups[c.date].push(c)
    }
    return groups
  }, [checkInsWithSpot])

  const totalCost = useMemo(() => {
    return checkIns.reduce((sum, c) => sum + (c.cost || 0), 0)
  }, [checkIns])

  const costByCategory = useMemo(() => {
    const result: Record<string, number> = {}
    ;(Object.keys(checkInCategoryConfig) as CheckInCategory[]).forEach((cat) => {
      result[cat] = 0
    })
    for (const c of checkIns) {
      const cat = c.category || 'other'
      result[cat] += c.cost || 0
    }
    return result
  }, [checkIns])

  const costByDate = useMemo(() => {
    const result: Record<string, number> = {}
    for (const c of checkIns) {
      if (!result[c.date]) result[c.date] = 0
      result[c.date] += c.cost || 0
    }
    return result
  }, [checkIns])

  if (!trip && tripLoaded) {
    return (
      <div className="page checkin-list-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">打卡记录</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><CircleHelp size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">找不到这个行程</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page checkin-list-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">打卡记录</h1>
        <div style={{ width: 48 }} />
      </header>

      {trip && (
        <div className="page-content">
          {checkIns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Camera size={48} strokeWidth={1.5} /></div>
              <h3 className="empty-title">还没有打卡记录</h3>
              <p className="empty-desc">去路线页完成第一个景点打卡吧</p>
              <Link to={`/trips/${tripId}/route`} className="btn btn-primary btn-block">
                去打卡
              </Link>
            </div>
          ) : (
            <>
              <div className="cost-summary">
                <div className="cost-total">
                  <span className="cost-label">总花费</span>
                  <span className="cost-amount">¥{totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="cost-section">
                <h3 className="section-title">按分类统计</h3>
                <div className="category-cost-list">
                  {(Object.keys(checkInCategoryConfig) as CheckInCategory[]).map((cat) => {
                    const config = checkInCategoryConfig[cat]
                    const amount = costByCategory[cat]
                    if (amount === 0) return null
                    const percentage = totalCost > 0 ? (amount / totalCost) * 100 : 0
                    return (
                      <div key={cat} className="category-cost-item">
                        <div className="category-cost-header">
                          <span className="category-icon-small">{config.icon}</span>
                          <span className="category-name">{config.name}</span>
                          <span className="category-amount">¥{amount.toFixed(2)}</span>
                        </div>
                        <div className="category-cost-bar">
                          <div
                            className="category-cost-fill"
                            style={{ width: `${percentage}%`, backgroundColor: config.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="checkin-groups">
                {Object.entries(groupedByDate).map(([date, dayCheckIns]) => {
                  const dayCost = costByDate[date] || 0
                  return (
                    <div key={date} className="checkin-group">
                      <h3 className="checkin-date">
                        <span className="date-dot" />
                        {formatDate(date)}
                        <span className="checkin-count">{dayCheckIns.length}个打卡</span>
                        {dayCost > 0 && <span className="day-cost">¥{dayCost.toFixed(2)}</span>}
                      </h3>
                      <div className="checkin-cards">
                        {dayCheckIns.map((checkin) => {
                          const catConfig = checkin.category
                            ? checkInCategoryConfig[checkin.category]
                            : checkInCategoryConfig.other
                          return (
                            <div key={checkin.id} className="checkin-card card">
                              <div className="checkin-spot">
                                <h4 className="spot-name">
                                  {checkin.spot?.name || '未知景点'}
                                </h4>
                                <div className="checkin-meta">
                                  {checkin.spot?.category && (
                                    <span className="spot-category">
                                      {checkin.spot.category}
                                    </span>
                                  )}
                                  {checkin.category && (
                                    <span
                                      className="checkin-category-badge"
                                      style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
                                    >
                                      {catConfig.icon} {catConfig.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {checkin.photos && checkin.photos.length > 0 && (
                                <div className="checkin-photos">
                                  {checkin.photos.slice(0, 3).map((photo, index) => (
                                    <div key={index} className="checkin-photo-thumb">
                                      <img src={photo} alt="" className="checkin-photo-img" />
                                    </div>
                                  ))}
                                  {checkin.photos.length > 3 && (
                                    <div className="checkin-photo-more">
                                      +{checkin.photos.length - 3}
                                    </div>
                                  )}
                                </div>
                              )}
                              {checkin.notes && (
                                <p className="checkin-notes">{checkin.notes}</p>
                              )}
                              {checkin.cost !== undefined && checkin.cost > 0 && (
                                <p className="checkin-cost">💰 ¥{checkin.cost}</p>
                              )}
                              <div className="checkin-footer">
                                <span className="checkin-time">
                                  {new Date(checkin.createdAt).toLocaleTimeString('zh-CN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() =>
                                    navigate(`/trips/${tripId}/checkin/${checkin.spotId}/edit`)
                                  }
                                >
                                  编辑
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CheckInListPage
