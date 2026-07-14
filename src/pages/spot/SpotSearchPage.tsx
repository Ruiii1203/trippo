import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, MapPin, AlertCircle, RefreshCw } from 'lucide-react'
import { useSpotStore } from '../../stores/useSpotStore'
import { useTripStore } from '../../stores/useTripStore'
import { searchAmapPois } from '../../api/amap'
import type { Spot } from '../../types'

const DEBOUNCE_DELAY = 300

interface SearchResult extends Spot {
  source?: 'amap' | 'local'
}

function SpotSearchPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { loaded, loadSpots, searchSpots, toggleWishlist, addOrUpdateSpotToTrip, findDuplicateSpot } = useSpotStore()
  const { trips } = useTripStore()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const trip = trips.find((t) => t.id === tripId)
  const city = trip?.destination || ''

  useEffect(() => {
    if (!loaded) {
      loadSpots()
    }
  }, [loaded, loadSpots])

  const debouncedSearch = useCallback(() => {
    if (!query.trim()) {
      setResults([])
      setHasSearched(false)
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    const currentRequestId = ++requestIdRef.current

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    searchAmapPois(query.trim(), city, controller.signal)
      .then((amapResult) => {
        if (currentRequestId !== requestIdRef.current) return

        setLoading(false)

        if (!amapResult.success && !amapResult.notConfigured) {
          setError(amapResult.error || '地图搜索暂不可用，可使用本地推荐或稍后再试')
        }

        let finalResults: SearchResult[] = []

        if (amapResult.success && amapResult.data.length > 0) {
          finalResults = amapResult.data.map((poi) => ({
            id: poi.id,
            tripId: tripId || '',
            name: poi.name,
            address: poi.address,
            lat: poi.lat,
            lng: poi.lng,
            category: poi.category,
            wishlisted: false,
            source: 'amap',
          }))
        }

        const localResults = tripId ? searchSpots(query.trim(), tripId) : []
        const localSearchResults = localResults.map((spot) => ({
          ...spot,
          source: 'local' as const,
        }))

        const seenKeys = new Set<string>()
        finalResults.forEach((r) => {
          seenKeys.add(`${r.name}_${r.address}`)
        })

        for (const local of localSearchResults) {
          const key = `${local.name}_${local.address}`
          if (!seenKeys.has(key)) {
            finalResults.push(local)
            seenKeys.add(key)
          }
        }

        setResults(finalResults)
        setHasSearched(true)
      })
      .catch(() => {
        if (currentRequestId !== requestIdRef.current) return
        setLoading(false)
        setError('网络异常，请检查网络连接')

        if (tripId) {
          const localResults = searchSpots(query.trim(), tripId).map((spot) => ({
            ...spot,
            source: 'local' as const,
          }))
          setResults(localResults)
          setHasSearched(true)
        }
      })
  }, [query, city, tripId, searchSpots])

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, DEBOUNCE_DELAY)
    return () => clearTimeout(timer)
  }, [debouncedSearch])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  function handleToggleWishlist(spot: Spot) {
    if (!tripId) return

    const existing = findDuplicateSpot(spot.name, spot.address, tripId)

    if (existing) {
      toggleWishlist(existing.id)
    } else {
      addOrUpdateSpotToTrip(
        {
          name: spot.name,
          address: spot.address,
          lat: spot.lat,
          lng: spot.lng,
          category: spot.category,
          coverImage: spot.coverImage,
          rating: spot.rating,
        },
        tripId,
        true
      )
    }

    if (hasSearched && query.trim()) {
      const res = searchSpots(query.trim(), tripId)
      setResults(res.map((s) => ({ ...s, source: 'local' as const })))
    }
  }

  function handleHotTagClick(tag: string) {
    setQuery(tag)
  }

  return (
    <div className="page spot-search-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">搜索景点</h1>
        <div style={{ width: 48 }} />
      </header>

      <div className="search-bar-wrap">
        <div className="search-bar">
          <span className="search-icon">
            <Search size={18} strokeWidth={2} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="搜索景点、美食、购物..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setQuery('')
                setResults([])
                setHasSearched(false)
                setError('')
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="search-error">
          <AlertCircle size={16} strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <div className="page-content">
        {!hasSearched ? (
          <div className="search-tips">
            <p className="search-tips-title">热门搜索</p>
            <div className="search-tags">
              {['迪士尼', '浅草寺', '拉面', '银座', '上野公园', '秋叶原'].map((tag) => (
                <button
                  key={tag}
                  className="search-tag"
                  onClick={() => handleHotTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <div className="search-loading">
            <RefreshCw size={24} strokeWidth={2} className="loading-spinner" />
            <span>搜索中...</span>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h3 className="empty-title">没有找到相关地点</h3>
            <p className="empty-desc">试试换个关键词搜索吧</p>
          </div>
        ) : (
          <div className="spot-list">
            {results.map((spot) => {
              const existing = findDuplicateSpot(spot.name, spot.address, tripId || '')
              const isWishlisted = existing?.wishlisted || false
              return (
                <div key={spot.id} className="spot-card card">
                  <div className="spot-info">
                    <div className="spot-name-row">
                      <h3 className="spot-name">{spot.name}</h3>
                      {spot.source === 'amap' && (
                        <span className="spot-source-badge">地图</span>
                      )}
                    </div>
                    {spot.category && (
                      <span className="spot-category">{spot.category}</span>
                    )}
                    {spot.address && (
                      <p className="spot-address">
                        <MapPin size={14} strokeWidth={1.5} />
                        {spot.address}
                      </p>
                    )}
                    {spot.rating && (
                      <p className="spot-rating">⭐ {spot.rating}</p>
                    )}
                    {(spot.lat && spot.lng) && (
                      <p className="spot-coords">
                        {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <button
                    className={`btn wishlist-btn ${
                      isWishlisted ? 'wishlisted' : ''
                    }`}
                    onClick={() => handleToggleWishlist(spot)}
                  >
                    {isWishlisted ? '✓ 已心愿' : '+ 心愿'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SpotSearchPage
