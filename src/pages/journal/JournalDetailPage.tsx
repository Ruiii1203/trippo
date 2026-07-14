import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircleHelp } from 'lucide-react'
import { useJournalStore } from '../../stores/useJournalStore'
import { useTripStore } from '../../stores/useTripStore'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

function JournalDetailPage() {
  const { journalId, tripId } = useParams<{ tripId: string; journalId: string }>()
  const navigate = useNavigate()
  const { getJournalById, deleteJournal, loaded: journalLoaded, loadJournals } = useJournalStore()
  const { getTripById, loaded: tripLoaded, loadTrips } = useTripStore()

  const [showActionSheet, setShowActionSheet] = useState(false)

  useEffect(() => {
    if (!journalLoaded) loadJournals()
    if (!tripLoaded) loadTrips()
  }, [journalLoaded, tripLoaded, loadJournals, loadTrips])

  const journal = journalId ? getJournalById(journalId) : undefined
  const trip = tripId ? getTripById(tripId) : undefined

  const handleShare = () => {
    if (!journal) return
    const shareText = `我在 Trippo 记录了「${journal.title}」手账\n\n${journal.content.slice(0, 100)}...`
    if (navigator.share) {
      navigator.share({ title: journal.title, text: shareText })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('手账内容已复制到剪贴板')
    }
    setShowActionSheet(false)
  }

  const handleEdit = () => {
    if (!tripId || !journalId) return
    navigate(`/trips/${tripId}/journals/${journalId}/edit`)
    setShowActionSheet(false)
  }

  const handleDelete = () => {
    if (!journal) return
    if (confirm(`确定删除手账「${journal.title}」吗？`)) {
      deleteJournal(journal.id)
      navigate(-1)
    }
    setShowActionSheet(false)
  }

  if (!journal && journalLoaded) {
    return (
      <div className="page journal-detail-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">手账详情</h1>
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
    <div className="page journal-detail-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">手账详情</h1>
        <button className="btn btn-ghost" onClick={() => setShowActionSheet(true)}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </header>

      {journal && (
        <div className="page-content">
          <div className="journal-hero-wrapper">
            <div className="journal-hero-image">
              {journal.coverImage ? (
                <img src={journal.coverImage} alt={journal.title} className="journal-hero-img" />
              ) : (
                <div className="journal-hero-placeholder">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="journal-detail-header">
            <h1 className="journal-title-lg">{journal.title}</h1>
            <div className="journal-detail-meta">
              {trip && <span className="journal-detail-trip">{trip.title}</span>}
              <span className="journal-detail-date">{formatDate(journal.createdAt)}</span>
            </div>
          </div>

          <article className={`journal-content card template-${journal.template || 'classic'}`}>
            <div className="journal-body">
              {journal.content.split('\n').map((line, index) => {
                if (line === '---') {
                  return <div key={index} className="journal-divider" />
                }
                return (
                  <p key={index} className="journal-paragraph">
                    {line || '\u00A0'}
                  </p>
                )
              })}
            </div>
          </article>

          <div className="journal-detail-actions">
            <button className="btn btn-secondary btn-block" onClick={handleEdit}>
              编辑手账
            </button>
          </div>
        </div>
      )}

      {showActionSheet && journal && (
        <>
          <div className="action-sheet-overlay" onClick={() => setShowActionSheet(false)} />
          <div className="action-sheet">
            <div className="action-sheet-header">
              <span className="action-sheet-title">{journal.title}</span>
            </div>
            <div className="action-sheet-actions">
              <button className="action-sheet-btn" onClick={handleShare}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                分享
              </button>
              <button className="action-sheet-btn" onClick={handleEdit}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
                编辑
              </button>
              <button className="action-sheet-btn destructive" onClick={handleDelete}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                删除
              </button>
            </div>
            <button className="action-sheet-cancel" onClick={() => setShowActionSheet(false)}>取消</button>
          </div>
        </>
      )}
    </div>
  )
}

export default JournalDetailPage