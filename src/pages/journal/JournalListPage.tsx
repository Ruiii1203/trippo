import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { BookOpen, CircleHelp } from 'lucide-react'
import { useTripStore } from '../../stores/useTripStore'
import { useCheckInStore } from '../../stores/useCheckInStore'
import { useSpotStore } from '../../stores/useSpotStore'
import { useJournalStore } from '../../stores/useJournalStore'
import { journalTemplates } from '../../data/mockLists'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function JournalListPage() {
  const { tripId } = useParams<{ tripId: string }>()
  const navigate = useNavigate()
  const { getTripById, loaded: tripLoaded, loadTrips } = useTripStore()
  const { getCheckInsByTrip, loaded: checkInLoaded, loadCheckIns } = useCheckInStore()
  const { getSpotsByTrip, loaded: spotLoaded, loadSpots } = useSpotStore()
  const {
    getJournalsByTrip, addJournal, generateDraft, loaded: journalLoaded, loadJournals,
  } = useJournalStore()

  const [generating, setGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('classic')
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)

  useEffect(() => {
    if (!tripLoaded) loadTrips()
    if (!checkInLoaded) loadCheckIns()
    if (!spotLoaded) loadSpots()
    if (!journalLoaded) loadJournals()
  }, [tripLoaded, checkInLoaded, spotLoaded, journalLoaded, loadTrips, loadCheckIns, loadSpots, loadJournals])

  const trip = tripId ? getTripById(tripId) : undefined
  const journals = tripId ? getJournalsByTrip(tripId) : []
  const checkIns = tripId ? getCheckInsByTrip(tripId) : []
  const spots = tripId ? getSpotsByTrip(tripId) : []

  function handleGenerateDraft() {
    if (!trip || checkIns.length === 0) return
    setGenerating(true)
    setTimeout(() => {
      const draft = generateDraft(trip, checkIns, spots)
      const newJournal = addJournal({
        tripId: trip.id,
        title: draft.title,
        content: draft.content,
        coverImage: draft.coverImage,
        template: selectedTemplate,
      })
      setGenerating(false)
      navigate(`/trips/${tripId}/journal/${newJournal.id}`)
    }, 800)
  }

  if (!trip && tripLoaded) {
    return (
      <div className="page journal-list-page">
        <header className="page-header">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← 返回
          </button>
          <h1 className="page-title">旅行手账</h1>
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
    <div className="page journal-list-page">
      <header className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h1 className="page-title">旅行手账</h1>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate(`/trips/${tripId}/journals/new`)}
        >
          + 写手账
        </button>
      </header>

      {trip && (
        <div className="page-content">
          <div className="journal-generate-section">
            <button
              className="btn btn-primary btn-block"
              onClick={() => setShowTemplatePicker(true)}
              disabled={generating || checkIns.length === 0}
            >
              {generating ? '生成中...' : '✨ 生成手账草稿'}
            </button>
            {checkIns.length === 0 && (
              <p className="journal-tip">先去打卡，再生成手账效果更好哦</p>
            )}
          </div>

          {journals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><BookOpen size={48} strokeWidth={1.5} /></div>
              <h3 className="empty-title">还没有手账</h3>
              <p className="empty-desc">点击上方按钮，基于打卡记录生成专属旅行手账</p>
            </div>
          ) : (
            <div className="journal-list">
              {journals.map((journal) => (
              <Link
                key={journal.id}
                to={`/trips/${tripId}/journal/${journal.id}`}
                className="journal-card card"
              >
                <div className="journal-template-tag">
                  {journal.template ? journalTemplates[journal.template as keyof typeof journalTemplates]?.name : '经典'}
                </div>
                <h3 className="journal-title">{journal.title}</h3>
                <p className="journal-preview">
                  {journal.content.slice(0, 80)}...
                </p>
                <div className="journal-meta">
                  <span className="journal-date">
                    {formatDate(journal.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      )}

      {generating && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p className="loading-text">正在生成手账...</p>
        </div>
      )}

      {showTemplatePicker && (
        <div className="panel-overlay" onClick={() => setShowTemplatePicker(false)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
              <h3 className="panel-title">选择手账模板</h3>
              <button className="btn btn-ghost" onClick={() => setShowTemplatePicker(false)}>
                关闭
              </button>
            </div>
            <div className="panel-content">
              <div className="template-grid">
                {Object.entries(journalTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    className={`template-card ${selectedTemplate === key ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedTemplate(key)
                      setShowTemplatePicker(false)
                      handleGenerateDraft()
                    }}
                  >
                    <div className="template-preview">
                      <span className="template-icon">📔</span>
                    </div>
                    <h4 className="template-name">{template.name}</h4>
                    <p className="template-desc">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JournalListPage
