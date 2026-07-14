import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTripStore } from '../../stores/useTripStore'
import { useToast } from '../../components/Toast'
import { readImageFileAsDataURL, isLargeImage } from '../../utils/image'

function CreateTripPage() {
  const navigate = useNavigate()
  const { tripId } = useParams<{ tripId?: string }>()
  const { addTrip, updateTrip, getTripById, loaded, loadTrips } = useTripStore()
  const { success, error: showError, warning } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined)

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (tripId && !loaded) {
      loadTrips()
    }
  }, [tripId, loaded, loadTrips])

  useEffect(() => {
    if (tripId && loaded) {
      const trip = getTripById(tripId)
      if (trip) {
        setTitle(trip.title)
        setDestination(trip.destination)
        setStartDate(trip.startDate)
        setEndDate(trip.endDate)
        setDescription(trip.description || '')
        setCoverImage(trip.coverImage)
      }
    }
  }, [tripId, loaded, getTripById])

  const isEditing = !!tripId

  function validate(): boolean {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = '请输入行程名称'
    }
    if (!destination.trim()) {
      newErrors.destination = '请输入目的地'
    }
    if (!startDate) {
      newErrors.startDate = '请选择开始日期'
    }
    if (!endDate) {
      newErrors.endDate = '请选择结束日期'
    }
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = '结束日期不能早于开始日期'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (isLargeImage(file)) {
      warning('图片较大，可能占用较多本地空间')
    }

    try {
      const dataUrl = await readImageFileAsDataURL(file)
      setCoverImage(dataUrl)
    } catch (err) {
      showError(err instanceof Error ? err.message : '图片上传失败')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleRemoveCover() {
    setCoverImage(undefined)
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    try {
      if (isEditing && tripId) {
        updateTrip(tripId, {
          title: title.trim(),
          destination: destination.trim(),
          startDate,
          endDate,
          description: description.trim() || undefined,
          coverImage,
        })
        success('行程已更新')
        navigate(`/trips/${tripId}`, { replace: true })
      } else {
        const newTrip = addTrip({
          title: title.trim(),
          destination: destination.trim(),
          startDate,
          endDate,
          description: description.trim() || undefined,
          coverImage,
        })
        success('行程创建成功')
        navigate(`/trips/${newTrip.id}`, { replace: true })
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : '保存失败，请重试')
    }
  }

  return (
    <div className="page create-trip-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">{isEditing ? '编辑行程' : '创建行程'}</h1>
        <div style={{ width: 48 }} />
      </header>

      <form className="page-content" onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className="form-group">
          <label className="form-label">行程封面</label>
          {coverImage ? (
            <div className="cover-upload-preview">
              <img src={coverImage} alt="行程封面" className="cover-image" />
              <div className="cover-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleUploadClick}
                >
                  更换封面
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleRemoveCover}
                >
                  移除封面
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="cover-upload-card"
              onClick={handleUploadClick}
            >
              <div className="cover-upload-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="cover-upload-text">上传行程封面</span>
              <span className="cover-upload-hint">支持 JPG、PNG 格式</span>
            </button>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">行程名称</label>
          <input
            type="text"
            className="form-input"
            placeholder="例如：东京五日游"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">目的地</label>
          <input
            type="text"
            className="form-input"
            placeholder="例如：日本·东京"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          {errors.destination && (
            <p className="form-error">{errors.destination}</p>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">开始日期</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && (
              <p className="form-error">{errors.startDate}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">结束日期</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && <p className="form-error">{errors.endDate}</p>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">备注（选填）</label>
          <textarea
            className="form-input form-textarea"
            placeholder="记录一下这次旅行的想法..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-block">
            {isEditing ? '保存修改' : '创建行程'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateTripPage
