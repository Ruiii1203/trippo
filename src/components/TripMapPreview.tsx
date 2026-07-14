import { useEffect, useRef, useState } from 'react'
import { MapPin, AlertCircle, Map } from 'lucide-react'
import { loadAmap, isAmapJsKeyConfigured } from '../utils/loadAmap'
import type { Spot } from '../types'

interface TripMapPreviewProps {
  spots: Spot[]
  height?: number
}

function sortSpots(spots: Spot[]): Spot[] {
  const withCoords = spots.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number')
  const scheduled = withCoords.filter((s) => s.dayIndex !== undefined)
  const unscheduled = withCoords.filter((s) => s.dayIndex === undefined)

  scheduled.sort((a, b) => {
    const dayDiff = (a.dayIndex ?? 0) - (b.dayIndex ?? 0)
    if (dayDiff !== 0) return dayDiff
    return (a.orderInDay ?? 0) - (b.orderInDay ?? 0)
  })

  return [...scheduled, ...unscheduled]
}

function TripMapPreview({ spots, height = 240 }: TripMapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const validSpots = sortSpots(spots)
  const hasValidSpots = validSpots.length > 0
  const hasKey = isAmapJsKeyConfigured()

  useEffect(() => {
    if (!hasKey || !hasValidSpots || !mapContainerRef.current) return

    let mounted = true
    setLoading(true)
    setError('')

    loadAmap()
      .then((AMap) => {
        if (!mounted || !mapContainerRef.current) return

        const firstSpot = validSpots[0]
        const map = new AMap.Map(mapContainerRef.current, {
          center: [firstSpot.lng, firstSpot.lat],
          zoom: validSpots.length > 1 ? 12 : 13,
          mapStyle: 'amap://styles/normal',
          zoomEnable: true,
          dragEnable: true,
        })

        mapRef.current = map

        const markers: any[] = []
        validSpots.forEach((spot, index) => {
          const content = `
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background-color: #FF7A45;
              color: #fff;
              font-size: 13px;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(255, 122, 69, 0.4);
              border: 2px solid #fff;
            ">${index + 1}</div>
          `

          const marker = new AMap.Marker({
            position: [spot.lng, spot.lat],
            content: content,
            offset: new AMap.Pixel(-14, -14),
            anchor: 'center',
          })

          marker.on('click', () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.close()
            }

            const infoContent = `
              <div style="padding: 4px 2px; min-width: 160px;">
                <div style="font-size: 14px; font-weight: 600; color: #1A1A1A; margin-bottom: 4px;">${spot.name}</div>
                ${spot.address ? `<div style="font-size: 12px; color: #4A4A4A; margin-bottom: 4px;">${spot.address}</div>` : ''}
                ${spot.category ? `<div style="display: inline-block; font-size: 11px; color: #FF7A45; background: rgba(255,122,69,0.1); padding: 2px 8px; border-radius: 999px;">${spot.category}</div>` : ''}
              </div>
            `

            const infoWindow = new AMap.InfoWindow({
              content: infoContent,
              offset: new AMap.Pixel(0, -18),
            })

            infoWindow.open(map, marker.getPosition())
            infoWindowRef.current = infoWindow
          })

          markers.push(marker)
          map.add(marker)
        })

        markersRef.current = markers

        if (markers.length > 1) {
          map.setFitView(markers, false, [40, 40, 40, 40])
        }
      })
      .catch((err: Error) => {
        if (!mounted) return
        setError(err.message || '地图加载失败')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false

      if (infoWindowRef.current) {
        infoWindowRef.current.close()
        infoWindowRef.current = null
      }

      if (markersRef.current.length > 0 && mapRef.current) {
        markersRef.current.forEach((m) => mapRef.current.remove(m))
        markersRef.current = []
      }

      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [hasKey, hasValidSpots, validSpots.length])

  if (!hasKey) {
    return (
      <div className="trip-map-preview card">
        <div className="map-preview-header">
          <div className="map-preview-title-row">
            <Map size={18} strokeWidth={1.5} />
            <h3 className="map-preview-title">地图预览</h3>
          </div>
        </div>
        <div className="map-preview-empty">
          <div className="empty-icon-small">
            <AlertCircle size={24} strokeWidth={1.5} />
          </div>
          <p className="map-preview-empty-text">地图功能暂不可用</p>
        </div>
      </div>
    )
  }

  if (!hasValidSpots) {
    return (
      <div className="trip-map-preview card">
        <div className="map-preview-header">
          <div className="map-preview-title-row">
            <Map size={18} strokeWidth={1.5} />
            <h3 className="map-preview-title">地图预览</h3>
          </div>
        </div>
        <div className="map-preview-empty">
          <div className="empty-icon-small">
            <MapPin size={24} strokeWidth={1.5} />
          </div>
          <p className="map-preview-empty-text">暂无可预览的地点，先去添加带定位的心愿吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="trip-map-preview card">
      <div className="map-preview-header">
        <div className="map-preview-title-row">
          <Map size={18} strokeWidth={1.5} />
          <h3 className="map-preview-title">地图预览</h3>
          <span className="map-preview-count">{validSpots.length} 个地点</span>
        </div>
        <p className="map-preview-subtitle">查看已安排景点的位置分布</p>
      </div>
      <div
        className="map-preview-container"
        style={{ height: `${height}px` }}
      >
        {loading && (
          <div className="map-loading">
            <div className="loading-spinner-small" />
            <span>地图加载中...</span>
          </div>
        )}
        {error && !loading && (
          <div className="map-error">
            <AlertCircle size={18} strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}
        <div ref={mapContainerRef} className="map-canvas" />
      </div>
    </div>
  )
}

export default TripMapPreview
