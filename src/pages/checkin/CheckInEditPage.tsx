import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'
import { useSpotStore } from '../../stores/useSpotStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { useToast } from '../../components/Toast'
import { checkInCategoryConfig } from '../../data/mockLists'
import { readImageFileAsDataURL, isLargeImage } from '../../utils/image'
import type { CheckInCategory } from '../../types'

const MAX_PHOTOS = 9

function CheckInEditPage() {
  const { tripId, spotId } = useParams<{ tripId: string; spotId: string }>()
  const navigate = useNavigate()
  const { getSpotsByTrip, loaded: spotLoaded, loadSpots } = useSpotStore()
  const {
    getCheckInBySpotAndDate,
    addCheckIn,
    updateCheckIn,
    loaded: checkInLoaded,
    loadCheckIns,
  } = useCheckInStore()
  const { success, error: showError, warning } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [photos, setPhotos] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [cost, setCost] = useState('')
  const [category, setCategory] = useState<CheckInCategory>('sightseeing')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!spotLoaded) loadSpots()
    if (!checkInLoaded) loadCheckIns()
  }, [spotLoaded, checkInLoaded, loadSpots, loadCheckIns])

  const spot = tripId && spotId
    ? getSpotsByTrip(tripId).find((s) => s.id === spotId)
    : undefined

  const existingCheckIn = spotId ? getCheckInBySpotAndDate(spotId, date) : undefined

  useEffect(() => {
    if (existingCheckIn) {
      setPhotos(existingCheckIn.photos || [])
      setNotes(existingCheckIn.notes || '')
      setCost(existingCheckIn.cost?.toString() || '')
      setCategory(existingCheckIn.category || 'sightseeing')
    } else {
      setPhotos([])
      setNotes('')
      setCost('')
      setCategory('sightseeing')
    }
  }, [existingCheckIn])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = MAX_PHOTOS - photos.length
    if (remainingSlots <= 0) {
      warning(`最多只能上传 ${MAX_PHOTOS} 张照片`)
      return
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots)
    const newPhotos: string[] = []

    for (const file of filesToProcess) {
      if (isLargeImage(file)) {
        warning('部分图片较大，可能占用较多本地空间')
      }

      try {
        const dataUrl = await readImageFileAsDataURL(file)
        newPhotos.push(dataUrl)
      } catch (err) {
        showError(err instanceof Error ? err.message : '图片上传失败')
      }
    }

    if (newPhotos.length > 0) {
      setPhotos([...photos, ...newPhotos])
    }

    if (files.length > remainingSlots) {
      warning(`最多只能上传 ${MAX_PHOTOS} 张照片，已自动截取前 ${remainingSlots} 张`)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleRemovePhoto(index: number) {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  function handleAddPhotoClick() {
    if (photos.length >= MAX_PHOTOS) {
      warning(`最多只能上传 ${MAX_PHOTOS} 张照片`)
      return
    }
    fileInputRef.current?.click()
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!tripId || !spotId) return

    try {
      if (existingCheckIn) {
        updateCheckIn(existingCheckIn.id, {
          notes: notes.trim() || undefined,
          cost: cost ? parseFloat(cost) : undefined,
          date,
          category,
          photos,
        })
      } else {
        addCheckIn({
          tripId,
          spotId,
          date,
          photos,
          notes: notes.trim() || undefined,
          cost: cost ? parseFloat(cost) : undefined,
          category,
        })
      }

      setSaved(true)
      success('打卡已保存')
      setTimeout(() => {
        setSaved(false)
        navigate(-1)
      }, 800)
    } catch (err) {
      showError(err instanceof Error ? err.message : '保存失败，请重试')
    }
  }

  if (!spot && spotLoaded) {
    return (
      <div className="page checkin-edit-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">景点打卡</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><CircleHelp size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">找不到这个景点</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page checkin-edit-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">景点打卡</h1>
        <div style={{ width: 48 }} />
      </header>

      {spot && (
        <form className="page-content" onSubmit={handleSave}>
          <div className="checkin-spot-info card">
            <h2 className="spot-name">{spot.name}</h2>
            {spot.address && <p className="spot-address">📍 {spot.address}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">打卡日期</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">花费分类</label>
            <div className="category-grid">
              {(Object.keys(checkInCategoryConfig) as CheckInCategory[]).map((cat) => {
                const config = checkInCategoryConfig[cat]
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`category-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                    style={{ '--cat-color': config.color } as React.CSSProperties}
                  >
                    <span className="category-icon">{config.icon}</span>
                    <span className="category-name">{config.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">打卡照片</label>
              <span className="photo-count">{photos.length}/{MAX_PHOTOS}</span>
            </div>
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`打卡照片 ${index + 1}`} className="photo-thumb" />
                  <button
                    type="button"
                    className="photo-remove-btn"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="photo-add-btn"
                  onClick={handleAddPhotoClick}
                >
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="photo-add-text">添加照片</span>
                </button>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">花费（元）</label>
            <input
              type="number"
              className="form-input"
              placeholder="例如：45"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">感受 / 备注</label>
            <textarea
              className="form-input form-textarea"
              placeholder="记录一下此刻的心情..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block">
              {existingCheckIn ? '保存修改' : '完成打卡'}
            </button>
          </div>
        </form>
      )}

      {saved && <div className="toast">已保存 ✓</div>}
    </div>
  )
}

export default CheckInEditPage
