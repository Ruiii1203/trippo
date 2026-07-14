import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, NotebookPen } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useJournalStore } from '../../stores/useJournalStore'
import JournalCard from '../../components/JournalCard'
import type { Journal, Trip } from '../../types'

function ActionSheet({ journal, tripName, onClose, onRename, onDuplicate, onDelete }: { journal: Journal & { tripName?: string }; tripName: string; onClose: () => void; onRename: (journal: Journal) => void; onDuplicate: (journal: Journal) => void; onDelete: (journal: Journal) => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <>
      <div className="action-sheet-overlay" onClick={onClose} />
      <div className="action-sheet">
        <div className="action-sheet-header">
          <span className="action-sheet-title">{journal.title}</span>
          <span className="action-sheet-subtitle">{tripName}</span>
        </div>
        <div className="action-sheet-actions">
          <button className="action-sheet-btn" onClick={() => { onRename(journal); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            重命名
          </button>
          <button className="action-sheet-btn" onClick={() => { onDuplicate(journal); onClose(); }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            复制
          </button>
          <button className="action-sheet-btn destructive" onClick={() => { onDelete(journal); onClose(); }}>
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

function GlobalJournalListPage() {
  const navigate = useNavigate()
  const { loaded: tripLoaded, loadTrips, trips } = useTripStore()
  const { loaded: journalLoaded, loadJournals, deleteJournal, addJournal, journals } = useJournalStore()

  const [selectedJournal, setSelectedJournal] = useState<(Journal & { tripName?: string }) | null>(null)
  const [showActionSheet, setShowActionSheet] = useState(false)

  useEffect(() => {
    if (!tripLoaded) loadTrips()
    if (!journalLoaded) loadJournals()
  }, [tripLoaded, journalLoaded, loadTrips, loadJournals])

  const allJournals = journals.map((journal) => {
    const trip = trips.find((t) => t.id === journal.tripId)
    return { ...journal, tripName: trip?.title || '未关联行程' }
  })

  const draftJournals = allJournals.filter((j) => j.status === 'draft')
  const publishedJournals = allJournals.filter((j) => j.status !== 'draft')

  const groupedJournals = trips.reduce((acc, trip) => {
    const tripJournals = publishedJournals.filter((j) => j.tripId === trip.id)
    if (tripJournals.length > 0) {
      acc.push({ trip, journals: tripJournals })
    }
    return acc
  }, [] as { trip: typeof trips[0]; journals: typeof allJournals }[])

  const orphanJournals = publishedJournals.filter((j) => !j.tripId)

  const handleMenuClick = (e: React.MouseEvent, journal: Journal & { tripName?: string }) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedJournal(journal)
    setShowActionSheet(true)
  }

  const handleRename = (journal: Journal) => {
    const newTitle = prompt('请输入新标题', journal.title)
    if (newTitle && newTitle.trim()) {
      if (journal.tripId) {
        navigate(`/trips/${journal.tripId}/journals/${journal.id}/edit`)
      } else {
        navigate(`/journals/${journal.id}/edit`)
      }
    }
  }

  const handleDuplicate = (journal: Journal) => {
    const duplicated = addJournal({
      ...journal,
      id: undefined as any,
      title: `${journal.title}（副本）`,
      status: 'draft' as const,
    })
    if (duplicated.tripId) {
      navigate(`/trips/${duplicated.tripId}/journals/${duplicated.id}/edit`)
    } else {
      navigate(`/journals/${duplicated.id}/edit`)
    }
  }

  const handleDelete = (journal: Journal) => {
    if (confirm(`确定删除手账「${journal.title}」吗？`)) {
      deleteJournal(journal.id)
    }
  }

  if (!tripLoaded || !journalLoaded) {
    return (
      <div className="page journal-list-page">
        <header className="page-header">
          <h1 className="page-title">旅行手账</h1>
        </header>
        <div className="page-content">
          <div className="skeleton-section">
            <div className="skeleton-section-header" />
            <div className="skeleton-journal-card" />
            <div className="skeleton-journal-card" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page journal-list-page">
      <header className="page-header">
        <h1 className="page-title">旅行手账</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/journals/new')}
        >
          + 写手账
        </button>
      </header>

      <div className="page-content">
        {draftJournals.length > 0 && (
          <div className="journal-section">
            <div className="section-header">
              <h2 className="section-title">草稿</h2>
              <span className="section-count">{draftJournals.length}</span>
            </div>
            <div className="journal-list">
              {draftJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  tripName={journal.tripName}
                  onMenuClick={handleMenuClick}
                />
              ))}
            </div>
          </div>
        )}

        {groupedJournals.map(({ trip, journals }) => (
          <div key={trip.id} className="journal-section">
            <div className="section-header">
              <h2 className="section-title">{trip.title}</h2>
              <span className="section-count">{journals.length}</span>
            </div>
            <div className="journal-list">
              {journals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  tripName={journal.tripName}
                  onMenuClick={handleMenuClick}
                />
              ))}
            </div>
          </div>
        ))}

        {orphanJournals.length > 0 && (
          <div className="journal-section">
            <div className="section-header">
              <h2 className="section-title">未关联行程</h2>
              <span className="section-count">{orphanJournals.length}</span>
            </div>
            <div className="journal-list">
              {orphanJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  tripName={journal.tripName}
                  onMenuClick={handleMenuClick}
                />
              ))}
            </div>
          </div>
        )}

        {allJournals.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><NotebookPen size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">还没有手账</h3>
            <p className="empty-desc">记录你的旅行故事，留下珍贵回忆</p>
            {trips.length > 0 && (
              <button
                className="btn btn-primary btn-block"
                onClick={() => navigate(`/trips/${trips[0].id}/journals`)}
              >
                去记录
              </button>
            )}
          </div>
        ) : null}

        {trips.length === 0 && allJournals.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon"><Globe size={48} strokeWidth={1.5} /></div>
            <h3 className="empty-title">还没有行程</h3>
            <p className="empty-desc">先创建一个行程，才能记录手账</p>
            <button className="btn btn-primary btn-block" onClick={() => navigate('/trips/create')}>
              创建行程
            </button>
          </div>
        )}
      </div>

      {showActionSheet && selectedJournal && (
        <ActionSheet
          journal={selectedJournal}
          tripName={selectedJournal.tripName}
          onClose={() => setShowActionSheet(false)}
          onRename={handleRename}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default GlobalJournalListPage