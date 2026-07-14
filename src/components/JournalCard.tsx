import { Link } from 'react-router-dom'
import type { Journal } from '../types'
import { journalTemplates } from '../data/mockLists'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${month}月${day}日 ${hour}:${minute}`
}

function getTemplateLabel(template?: string): string {
  if (!template) return ''
  return (journalTemplates as any)[template]?.name || ''
}

const templateColors: Record<string, string> = {
  classic: '#FF7A45',
  travel: '#3B82F6',
  cute: '#EC4899',
  minimal: '#6B7280',
}

interface JournalCardProps {
  journal: Journal
  tripName?: string
  onMenuClick?: (e: React.MouseEvent, journal: Journal) => void
  showMenu?: boolean
}

function JournalCard({ journal, tripName, onMenuClick, showMenu = true }: JournalCardProps) {
  const isDraft = journal.status === 'draft'
  const templateColor = journal.template ? templateColors[journal.template] || '#FF7A45' : '#FF7A45'
  const templateLabel = getTemplateLabel(journal.template)

  const detailUrl = isDraft
    ? journal.tripId
      ? `/trips/${journal.tripId}/journals/${journal.id}/edit`
      : `/journals/${journal.id}/edit`
    : journal.tripId
      ? `/trips/${journal.tripId}/journal/${journal.id}`
      : `/journals/${journal.id}`

  return (
    <div className="journal-card-wrapper-v2">
      <Link to={detailUrl} className="journal-card-v2">
        <div className="journal-card-cover-v2">
          {journal.coverImage ? (
            <img src={journal.coverImage} alt={journal.title} className="journal-cover-image-v2" />
          ) : (
            <div className="journal-cover-placeholder-v2">
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
          )}
          {templateLabel && (
            <span 
              className="journal-template-badge-v2"
              style={{ backgroundColor: templateColor }}
            >
              {templateLabel}
            </span>
          )}
        </div>

        <div className="journal-card-content-v2">
          <h3 className="journal-card-title-v2">{journal.title}</h3>
          
          <p className="journal-card-preview-v2">
            {journal.content.slice(0, 60)}...
          </p>

          <div className="journal-card-meta-v2">
            <div className="journal-card-meta-left">
              {tripName && <span className="journal-card-trip-v2">{tripName}</span>}
              <span className="journal-card-date-v2">{formatDate(journal.createdAt)}</span>
            </div>
            <span className={`journal-card-status-v2 ${isDraft ? 'draft' : 'published'}`}>
              {isDraft ? '草稿' : '已发布'}
            </span>
          </div>
        </div>
      </Link>

      {showMenu && onMenuClick && (
        <button
          className="journal-card-menu-v2"
          onClick={(e) => onMenuClick(e, journal)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default JournalCard