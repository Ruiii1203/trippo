import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Sparkles } from 'lucide-react'
import { useSpotStore } from '../../stores/useSpotStore'
import { useTripStore } from '../../stores/useTripStore'
import { useToast } from '../../components/Toast'
import { generateAIRoute, isArkConfigured } from '../../api/aiPlanner'

function getTotalDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

function WishlistPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { loaded: spotsLoaded, loadSpots, getWishlistedSpots, toggleWishlist, applyAIRoute } = useSpotStore()
  const { loaded: tripLoaded, loadTrips, getTripById, setAIRouteDraft } = useTripStore()
  const [showTip, setShowTip] = useState(false)
  const [isAIPlanning, setIsAIPlanning] = useState(false)

  useEffect(() => {
    if (!spotsLoaded) loadSpots()
    if (!tripLoaded) loadTrips()
  }, [spotsLoaded, tripLoaded, loadSpots, loadTrips])

  const trip = tripId ? getTripById(tripId) : undefined
  const wishlistedSpots = tripId ? getWishlistedSpots(tripId) : []

  function handleRemove(spotId: string) {
    toggleWishlist(spotId)
  }

  function handleAddToRoute() {
    setShowTip(true)
    setTimeout(() => setShowTip(false), 2000)
  }

  async function handleAIPlan() {
    if (!trip || !tripId) return
    if (wishlistedSpots.length === 0) {
      toast.info('先添加一些心愿，再让 AI 帮你安排吧')
      return
    }
    if (!isArkConfigured()) {
      toast.warning('请先配置火山方舟 API Key')
      return
    }
    if (wishlistedSpots.length < 3) {
      toast.warning('建议至少添加 3 个心愿，AI 安排会更合理')
    }

    setIsAIPlanning(true)
    try {
      const totalDays = getTotalDays(trip.startDate, trip.endDate)
      console.log('[Wishlist] Starting AI plan', { tripId, totalDays, wishlistedCount: wishlistedSpots.length })
      const result = await generateAIRoute(trip, wishlistedSpots, totalDays)
      console.log('[Wishlist] AI plan succeeded', { daysCount: result.days.length })
      applyAIRoute(tripId, result.days)
      console.log('[Wishlist] AIRoute applied')
      setAIRouteDraft(tripId, 'draft')
      console.log('[Wishlist] AIRoute draft set')
      toast.success('AI 已生成每日路线草稿')
      setTimeout(() => {
        navigate(`/trips/${tripId}/route`)
      }, 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 生成失败，请稍后再试'
      console.error('[Wishlist] AI plan failed', err)
      toast.error(message)
    } finally {
      setIsAIPlanning(false)
    }
  }

  return (
    <div className="page wishlist-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">景点心愿单</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/trips/${tripId}/spots/search`)}
        >
          + 添加
        </button>
      </header>

      {trip && (
        <div className="wishlist-summary">
          <p className="wishlist-count">
            共 <strong>{wishlistedSpots.length}</strong> 个心愿景点
          </p>
        </div>
      )}

      <div className="page-content">
        {wishlistedSpots.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Star size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">还没有心愿景点</h3>
            <p className="empty-desc">搜索并添加你想去的地方吧</p>
            <button
              className="btn btn-primary btn-block"
              onClick={() => navigate(`/trips/${tripId}/spots/search`)}
            >
              搜索景点
            </button>
          </div>
        ) : (
          <>
            <div className="spot-list">
              {wishlistedSpots.map((spot) => (
                <div key={spot.id} className="spot-card card">
                  <div className="spot-info">
                    <h3 className="spot-name">{spot.name}</h3>
                    {spot.category && (
                      <span className="spot-category">{spot.category}</span>
                    )}
                    {spot.address && (
                      <p className="spot-address">📍 {spot.address}</p>
                    )}
                    {spot.rating && (
                      <p className="spot-rating">⭐ {spot.rating}</p>
                    )}
                  </div>
                  <div className="spot-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddToRoute}
                    >
                      加入路线
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => handleRemove(spot.id)}
                      title="从心愿单移除"
                    >
                      ♡
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="wishlist-footer">
              <button
                className="btn btn-ai-plan btn-block"
                onClick={handleAIPlan}
                disabled={isAIPlanning}
              >
                <Sparkles size={18} strokeWidth={1.5} />
                {isAIPlanning ? 'AI 安排中…' : 'AI 帮我安排'}
              </button>
              <Link to={`/trips/${tripId}/spots/search`} className="btn btn-secondary btn-block">
                继续添加景点
              </Link>
            </div>
          </>
        )}

        {showTip && (
          <div className="toast">
            路线规划功能开发中，敬请期待
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
