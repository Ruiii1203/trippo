import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircleHelp, Map, Star, Sparkles, Check, RefreshCw, MoveRight } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useSpotStore } from '../../stores/useSpotStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { useToast } from '../../components/Toast'
import { generateAIRoute, isArkConfigured } from '../../api/aiPlanner'
import type { Spot } from '../../types'

function getDateForDay(startDate: string, dayIndex: number): string {
  const date = new Date(startDate)
  date.setDate(date.getDate() + dayIndex)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function getWeekday(startDate: string, dayIndex: number): string {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(startDate)
  date.setDate(date.getDate() + dayIndex)
  return weekdays[date.getDay()]
}

function getTotalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

function RoutePage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { getTripById, loaded: tripLoaded, loadTrips, loadAIRouteDrafts, aiRouteDrafts, setAIRouteDraft } = useTripStore()
  const {
    loaded: spotLoaded,
    loadSpots,
    getSpotsByDay,
    getUnassignedSpots,
    getWishlistedSpots,
    moveSpotUp,
    moveSpotDown,
    moveSpotToDay,
    removeSpotFromDay,
    addSpotToDay,
    applyAIRoute,
  } = useSpotStore()
  const {
    loaded: checkInLoaded,
    loadCheckIns,
    getCheckInsBySpot,
  } = useCheckInStore()

  const [activeDay, setActiveDay] = useState(0)
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [showMovePanel, setShowMovePanel] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [movingSpotId, setMovingSpotId] = useState<string | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  useEffect(() => {
    if (!tripLoaded) loadTrips()
    else loadAIRouteDrafts()
    if (!spotLoaded) loadSpots()
    if (!checkInLoaded) loadCheckIns()
  }, [tripLoaded, spotLoaded, checkInLoaded, loadTrips, loadAIRouteDrafts, loadSpots, loadCheckIns])

  const trip = tripId ? getTripById(tripId) : undefined
  const totalDays = trip ? getTotalDays(trip.startDate, trip.endDate) : 0
  const daySpots = tripId ? getSpotsByDay(tripId, activeDay) : []
  const unassignedSpots = tripId ? getUnassignedSpots(tripId) : []

  const dayTabs = Array.from({ length: totalDays }, (_, i) => i)

  function handleAddSpot(spot: Spot) {
    if (!tripId) return
    addSpotToDay(spot.id, activeDay)
  }

  function handleOpenMovePanel(spotId: string) {
    setMovingSpotId(spotId)
    setShowMovePanel(true)
  }

  function handleMoveToDay(toDay: number) {
    if (!tripId || !movingSpotId) return
    moveSpotToDay(movingSpotId, tripId, activeDay, toDay)
    setShowMovePanel(false)
    setMovingSpotId(null)
    toast.success(`已移到第${toDay + 1}天`)
  }

  const draft = tripId ? aiRouteDrafts.find((d) => d.tripId === tripId) : undefined
  const isDraft = draft?.status === 'draft'
  const hasAnyScheduled = tripId ? getSpotsByDay(tripId, activeDay).length > 0 : false

  function handleConfirmDraft() {
    if (!tripId || !isDraft) return
    setShowConfirmDialog(true)
  }

  function doConfirmDraft() {
    if (!tripId) return
    setShowConfirmDialog(false)
    setIsConfirming(true)
    setTimeout(() => {
      setAIRouteDraft(tripId, 'confirmed')
      setIsConfirming(false)
      toast.success('路线已保存')
    }, 500)
  }

  async function handleRegenerate() {
    if (!trip || !tripId) return
    const wishlisted = getWishlistedSpots(tripId)
    if (wishlisted.length === 0) {
      toast.info('先添加一些心愿，再让 AI 帮你安排吧')
      return
    }
    if (!isArkConfigured()) {
      toast.warning('请先配置火山方舟 API Key')
      return
    }
    if (wishlisted.length < 3) {
      toast.warning('建议至少添加 3 个心愿，AI 安排会更合理')
    }
    setIsRegenerating(true)
    try {
      const days = getTotalDays(trip.startDate, trip.endDate)
      const result = await generateAIRoute(trip, wishlisted, days)
      applyAIRoute(tripId, result.days)
      setAIRouteDraft(tripId, 'draft')
      toast.success('AI 已重新生成路线草稿')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 生成失败，请稍后再试'
      toast.error(message)
    } finally {
      setIsRegenerating(false)
    }
  }

  if (!trip && tripLoaded) {
    return (
      <div className="page route-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">每日路线</h1>
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
    <div className="page route-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">每日路线</h1>
        <div style={{ width: 48 }} />
      </header>

      {trip && (
        <>
          <div className="day-tabs">
            <div className="day-tabs-scroll">
              {dayTabs.map((dayIndex) => (
                <button
                  key={dayIndex}
                  className={`day-tab ${activeDay === dayIndex ? 'active' : ''}`}
                  onClick={() => setActiveDay(dayIndex)}
                >
                  <span className="day-tab-day">第{dayIndex + 1}天</span>
                  <span className="day-tab-date">
                    {getDateForDay(trip.startDate, dayIndex)}
                  </span>
                  <span className="day-tab-weekday">
                    {getWeekday(trip.startDate, dayIndex)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {isDraft && (
            <div className="ai-draft-banner">
              <div className="ai-draft-banner-left">
                <Sparkles size={16} strokeWidth={1.5} />
                <span className="ai-draft-banner-text">
                  AI 已帮你生成路线草稿，你可以继续微调
                </span>
              </div>
              <span className="ai-draft-badge">AI 草稿</span>
            </div>
          )}

          <div className="page-content">
            {daySpots.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Map size={48} strokeWidth={1.5} /></div>
                <h3 className="empty-title">第{activeDay + 1}天还没有安排</h3>
                <p className="empty-desc">从心愿单中添加景点来规划路线吧</p>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => setShowAddPanel(true)}
                >
                  添加景点
                </button>
              </div>
            ) : (
              <>
                <div className="route-spot-list">
                  {daySpots.map((spot, index) => {
                    const spotCheckIns = getCheckInsBySpot(spot.id)
                    const hasCheckIn = spotCheckIns.length > 0
                    return (
                      <div key={spot.id} className="route-spot-card card">
                        <div className="route-spot-order">
                          <span className="order-badge">{index + 1}</span>
                        </div>
                        <div className="route-spot-info">
                          <h3 className="spot-name">{spot.name}</h3>
                          {spot.category && (
                            <span className="spot-category">{spot.category}</span>
                          )}
                          {spot.address && (
                            <p className="spot-address">📍 {spot.address}</p>
                          )}
                          <button
                            className={`btn btn-sm ${hasCheckIn ? 'btn-secondary' : 'btn-outline-primary'}`}
                            style={{ marginTop: 8, width: 'auto', alignSelf: 'flex-start' }}
                            onClick={() => navigate(`/trips/${tripId}/checkin/${spot.id}/edit`)}
                          >
                            {hasCheckIn ? '✓ 已打卡' : '📸 去打卡'}
                          </button>
                        </div>
                        <div className="route-spot-actions">
                          <div className="order-buttons">
                            <button
                              className="order-btn"
                              disabled={index === 0}
                              onClick={() => moveSpotUp(spot.id, tripId!, activeDay)}
                              title="上移"
                            >
                              ↑
                            </button>
                            <button
                              className="order-btn"
                              disabled={index === daySpots.length - 1}
                              onClick={() => moveSpotDown(spot.id, tripId!, activeDay)}
                              title="下移"
                            >
                              ↓
                            </button>
                          </div>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => handleOpenMovePanel(spot.id)}
                            title="移到其他天"
                          >
                            <MoveRight size={16} strokeWidth={1.5} />
                          </button>
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => removeSpotFromDay(spot.id)}
                            title="从路线移除"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="route-footer">
                  <button
                    className="btn btn-secondary btn-block"
                    onClick={() => setShowAddPanel(true)}
                  >
                    + 添加景点
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {isDraft && (
        <div className="route-draft-footer">
          <button
            className="btn btn-secondary btn-block route-draft-secondary"
            onClick={handleRegenerate}
            disabled={isConfirming || isRegenerating}
          >
            {isRegenerating ? (
              <>
                <RefreshCw size={16} strokeWidth={2} className="spin" />
                生成中...
              </>
            ) : (
              <>重新生成</>
            )}
          </button>
          <button
            className="btn btn-primary btn-block route-draft-primary"
            onClick={handleConfirmDraft}
            disabled={isConfirming || isRegenerating}
          >
            {isConfirming ? (
              <>保存中...</>
            ) : (
              <>
                <Check size={18} strokeWidth={2} />
                确认并保存路线
              </>
            )}
          </button>
        </div>
      )}

      {showAddPanel && (
        <div className="panel-overlay" onClick={() => setShowAddPanel(false)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3 className="panel-title">添加到第{activeDay + 1}天</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowAddPanel(false)}
              >
                ✕
              </button>
            </div>
            <div className="panel-content">
              {unassignedSpots.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><Star size={48} strokeWidth={1.5} /></div>
                  <h3 className="empty-title">没有可添加的景点</h3>
                  <p className="empty-desc">去搜索页添加心愿景点吧</p>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      setShowAddPanel(false)
                      navigate(`/trips/${tripId}/spots/search`)
                    }}
                  >
                    搜索景点
                  </button>
                </div>
              ) : (
                <div className="spot-list">
                  {unassignedSpots.map((spot) => (
                    <div key={spot.id} className="spot-card card">
                      <div className="spot-info">
                        <h3 className="spot-name">{spot.name}</h3>
                        {spot.category && (
                          <span className="spot-category">{spot.category}</span>
                        )}
                        {spot.address && (
                          <p className="spot-address">📍 {spot.address}</p>
                        )}
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddSpot(spot)}
                      >
                        添加
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMovePanel && (
        <div className="panel-overlay" onClick={() => setShowMovePanel(false)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3 className="panel-title">移到哪一天？</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setShowMovePanel(false)}
              >
                ✕
              </button>
            </div>
            <div className="panel-content">
              <div className="move-day-grid">
                {dayTabs.map((dayIndex) => (
                  <button
                    key={dayIndex}
                    className={`move-day-btn ${dayIndex === activeDay ? 'active' : ''}`}
                    disabled={dayIndex === activeDay}
                    onClick={() => handleMoveToDay(dayIndex)}
                  >
                    <div className="move-day-num">第{dayIndex + 1}天</div>
                    <div className="move-day-date">{getDateForDay(trip!.startDate, dayIndex)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-icon">✨</div>
            <h3 className="confirm-dialog-title">确认保存路线？</h3>
            <p className="confirm-dialog-desc">
              保存后 AI 草稿标记将消失，路线将正式生效。你随时可以重新生成。
            </p>
            <div className="confirm-dialog-actions">
              <button
                className="btn btn-secondary btn-block"
                onClick={() => setShowConfirmDialog(false)}
              >
                再想想
              </button>
              <button
                className="btn btn-primary btn-block"
                onClick={doConfirmDraft}
                disabled={isConfirming}
              >
                {isConfirming ? '保存中...' : '确认保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoutePage
