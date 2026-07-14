import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'
import { useJournalStore } from '../../stores/useJournalStore'
import { useTripStore } from '../../stores/useTripStore'
import { useToast } from '../../components/Toast'
import { journalTemplates } from '../../data/mockLists'
import { readImageFileAsDataURL, isLargeImage } from '../../utils/image'
import type { Journal } from '../../types'

const templates = Object.entries(journalTemplates).map(([id, config]) => ({
  id,
  ...config,
}))

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function JournalEditorPage() {
  const { tripId, journalId } = useParams<{ tripId?: string; journalId: string }>()
  const navigate = useNavigate()
  const { getJournalById, updateJournal, addJournal, loaded: journalLoaded, loadJournals } = useJournalStore()
  const { getTripById, loaded: tripLoaded, loadTrips } = useTripStore()
  const { success, error: showError, warning } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [template, setTemplate] = useState('classic')
  const [status, setStatus] = useState<Journal['status']>('draft')
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined)
  const [saved, setSaved] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [showInsertSheet, setShowInsertSheet] = useState(false)

  useEffect(() => {
    if (!journalLoaded) loadJournals()
    if (!tripLoaded && tripId) loadTrips()
  }, [journalLoaded, tripLoaded, loadTrips, tripId])

  const journal = journalId ? getJournalById(journalId) : undefined
  const trip = tripId ? getTripById(tripId) : undefined

  useEffect(() => {
    if (journal) {
      setTitle(journal.title)
      setContent(journal.content)
      setTemplate(journal.template || 'classic')
      setStatus(journal.status || 'draft')
      setCoverImage(journal.coverImage)
    } else {
      setTitle('')
      setContent('')
      setTemplate('classic')
      setStatus('draft')
      setCoverImage(undefined)
    }
  }, [journal])

  const autoSave = useCallback(() => {
    if (!title.trim()) return
    const journalData = {
      title: title.trim(),
      content: content.trim(),
      template,
      status: 'draft' as const,
      coverImage,
    }
    if (journalId && journal) {
      updateJournal(journalId, journalData)
    } else {
      addJournal({ ...journalData, tripId: tripId || undefined })
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [title, content, template, coverImage, journalId, journal, tripId, updateJournal, addJournal])

  useEffect(() => {
    const timer = setTimeout(autoSave, 1000)
    return () => clearTimeout(timer)
  }, [autoSave])

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

  const handleSave = () => {
    try {
      const journalData = {
        title: title.trim(),
        content: content.trim(),
        template,
        status,
        coverImage,
      }
      let newJournalId = journalId
      if (journalId && journal) {
        updateJournal(journalId, journalData)
      } else {
        const newJournal = addJournal({ ...journalData, tripId: tripId || undefined })
        newJournalId = newJournal.id
      }
      setSaved(true)
      success('手账已保存')
      setTimeout(() => setSaved(false), 1500)
      if (tripId) {
        navigate(`/trips/${tripId}/journal/${newJournalId}`)
      } else {
        navigate(`/journals`)
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : '保存失败，请重试')
    }
  }

  const handlePublish = () => {
    setStatus('published')
    handleSave()
  }

  const handleInsertText = () => {
    setContent(content + '\n\n')
    setShowInsertSheet(false)
  }

  const handleInsertPhoto = () => {
    setContent(content + '\n📷 [图片]\n')
    setShowInsertSheet(false)
  }

  const handleInsertDivider = () => {
    setContent(content + '\n---\n')
    setShowInsertSheet(false)
  }

  if (!journal && journalLoaded && journalId) {
    return (
      <div className="page journal-editor-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">编辑手账</h1>
          <div style={{ width: 48 }} />
        </header>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-icon"><CircleHelp size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">找不到这篇手账</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page journal-editor-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          取消
        </button>
        <h1 className="page-title">编辑手账</h1>
        <button className="btn btn-primary" onClick={handleSave}>
          保存
        </button>
      </header>

      <div className="page-content">
        <div className="journal-cover-edit-section">
          {coverImage ? (
            <div className="journal-cover-preview-wrapper">
              <img src={coverImage} alt="手账封面" className="journal-cover-preview-img" />
              <div className="journal-cover-actions">
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
              className="journal-cover-upload-card"
              onClick={handleUploadClick}
            >
              <div className="journal-cover-upload-icon">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span className="journal-cover-upload-text">上传手账封面</span>
              <span className="journal-cover-upload-hint">支持 JPG、PNG 格式</span>
            </button>
          )}
        </div>

        <div className="journal-editor-header">
          <button
            className="template-selector"
            onClick={() => setShowTemplatePicker(true)}
          >
            <span className="template-selector-icon">🎨</span>
            <span className="template-selector-label">{journalTemplates[template as keyof typeof journalTemplates]?.name}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {saved && (
            <span className="save-status">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              已保存
            </span>
          )}
        </div>

        <div className="journal-edit-form">
          <input
            type="text"
            className="journal-edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="手账标题"
          />

          <div className="journal-edit-content">
            <textarea
              className="journal-edit-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录你的旅行故事..."
              rows={12}
            />

            <button
              className="journal-insert-btn"
              onClick={() => setShowInsertSheet(true)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {trip && (
          <div className="journal-editor-meta card">
            <div className="meta-item">
              <span className="meta-label">行程</span>
              <span className="meta-value">{trip.title}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">状态</span>
              <span className={`meta-value ${status === 'draft' ? 'meta-value-draft' : ''}`}>
                {status === 'draft' ? '草稿' : '已发布'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">更新时间</span>
              <span className="meta-value">{journal ? formatDate(journal.updatedAt) : '刚刚'}</span>
            </div>
          </div>
        )}

        <div className="journal-editor-footer">
          {status === 'draft' && (
            <button className="btn btn-primary btn-block" onClick={handlePublish}>
              发布手账
            </button>
          )}
        </div>
      </div>

      {showTemplatePicker && (
        <>
          <div className="action-sheet-overlay" onClick={() => setShowTemplatePicker(false)} />
          <div className="template-picker-sheet">
            <div className="template-picker-header">
              <span className="template-picker-title">选择模板</span>
              <button className="template-picker-close" onClick={() => setShowTemplatePicker(false)}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="template-picker-content">
              {templates.map((t) => (
                <button
                  key={t.id}
                  className={`template-option ${template === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setTemplate(t.id)
                    setShowTemplatePicker(false)
                  }}
                >
                  <div className="template-option-preview">
                    <span className="template-option-icon">📔</span>
                  </div>
                  <div className="template-option-info">
                    <span className="template-option-name">{t.name}</span>
                    <span className="template-option-desc">{t.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {showInsertSheet && (
        <>
          <div className="action-sheet-overlay" onClick={() => setShowInsertSheet(false)} />
          <div className="action-sheet">
            <div className="action-sheet-header">
              <span className="action-sheet-title">插入内容</span>
            </div>
            <div className="action-sheet-actions">
              <button className="action-sheet-btn" onClick={handleInsertText}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
                文本
              </button>
              <button className="action-sheet-btn" onClick={handleInsertPhoto}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                图片
              </button>
              <button className="action-sheet-btn" onClick={handleInsertDivider}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                分割线
              </button>
            </div>
            <button className="action-sheet-cancel" onClick={() => setShowInsertSheet(false)}>取消</button>
          </div>
        </>
      )}
    </div>
  )
}

export default JournalEditorPage
