import { ReactNode } from 'react'

type EmptyIconType = 
  | 'trip'
  | 'wishlist'
  | 'journal'
  | 'checkin'
  | 'spot'
  | 'route'
  | 'search'
  | 'list'
  | 'generic'

interface EmptyStateProps {
  icon?: EmptyIconType
  title: string
  description?: string
  hint?: string
  actionText?: string
  onAction?: () => void
  children?: ReactNode
}

const iconPaths: Record<EmptyIconType, ReactNode> = {
  trip: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 44h48" className="empty-icon-accent" strokeWidth="2" />
      <path d="M12 44V16a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v28" />
      <path d="M18 12V8" />
      <path d="M46 12V8" />
      <rect x="20" y="20" width="24" height="14" rx="2" />
      <path d="M26 27h12" />
      <path d="M26 32h8" />
      <circle cx="26" cy="44" r="3" />
      <circle cx="38" cy="44" r="3" />
    </svg>
  ),
  wishlist: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path 
        d="M32 50s-14-8.5-14-20a8 8 0 0 1 14-5.3A8 8 0 0 1 46 30c0 11.5-14 20-14 20z"
        className="empty-icon-accent"
        strokeWidth="2"
      />
      <circle cx="22" cy="24" r="1.5" fill="currentColor" opacity="0.3" />
      <circle cx="42" cy="26" r="1.5" fill="currentColor" opacity="0.3" />
      <path d="M28 34h8" opacity="0.5" />
    </svg>
  ),
  journal: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="16" y="8" width="32" height="48" rx="2" />
      <path d="M24 16h16" />
      <path d="M24 24h16" opacity="0.7" />
      <path d="M24 32h12" opacity="0.5" />
      <path d="M24 40h14" opacity="0.3" />
      <path d="M20 48h24" opacity="0.2" />
      <path d="M20 8v48" opacity="0.3" />
      <circle 
        cx="40" 
        cy="16" 
        r="2" 
        fill="var(--color-primary)" 
        stroke="none"
        className="empty-icon-dot"
      />
    </svg>
  ),
  checkin: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="16" width="40" height="40" rx="4" />
      <path d="M12 24h40" />
      <circle cx="20" cy="16" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="44" cy="16" r="2" fill="currentColor" opacity="0.5" />
      <circle 
        cx="32" 
        cy="38" 
        r="8" 
        className="empty-icon-accent"
        strokeWidth="2"
      />
      <path 
        d="M29 38l2.5 2.5 4.5-4.5"
        className="empty-icon-accent"
        strokeWidth="2"
      />
      <path d="M24 48h16" opacity="0.3" />
    </svg>
  ),
  spot: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 8C22 8 14 16 14 26c0 14 18 30 18 30s18-16 18-30c0-10-8-18-18-18z" />
      <circle 
        cx="32" 
        cy="26" 
        r="6"
        className="empty-icon-accent"
        strokeWidth="2"
      />
      <path d="M14 50h36" opacity="0.3" />
    </svg>
  ),
  route: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 52V16a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v36" />
      <circle cx="24" cy="20" r="3" className="empty-icon-accent" strokeWidth="2" />
      <circle cx="40" cy="32" r="3" className="empty-icon-accent" strokeWidth="2" />
      <circle cx="28" cy="44" r="3" className="empty-icon-accent" strokeWidth="2" />
      <path d="M27 23c2 4 8 6 10 6" opacity="0.5" />
      <path d="M37 35c-2 4-8 6-10 6" opacity="0.5" />
      <path d="M12 56h40" opacity="0.3" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="26" cy="26" r="14" />
      <path d="M37 37l12 12" className="empty-icon-accent" strokeWidth="2" />
      <path d="M18 26h16" opacity="0.3" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="12" y="8" width="40" height="48" rx="4" />
      <path d="M20 18h24" />
      <circle 
        cx="40" 
        cy="18" 
        r="2" 
        fill="var(--color-primary)" 
        stroke="none"
        className="empty-icon-dot"
      />
      <path d="M20 28h20" opacity="0.7" />
      <path d="M20 38h16" opacity="0.5" />
      <path d="M20 48h24" opacity="0.3" />
    </svg>
  ),
  generic: (
    <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="32" cy="32" r="20" />
      <path d="M32 24v8" className="empty-icon-accent" strokeWidth="2" />
      <circle 
        cx="32" 
        cy="40" 
        r="1.5" 
        fill="var(--color-primary)" 
        stroke="none"
        className="empty-icon-dot"
      />
    </svg>
  ),
}

function EmptyState({ 
  icon = 'generic', 
  title, 
  description, 
  hint, 
  actionText, 
  onAction,
  children 
}: EmptyStateProps) {
  return (
    <div className="trippo-empty">
      <div className="trippo-empty-icon">
        {iconPaths[icon]}
      </div>
      
      <h2 className="trippo-empty-title">{title}</h2>
      
      {description && (
        <p className="trippo-empty-desc">{description}</p>
      )}
      
      {hint && (
        <p className="trippo-empty-hint">{hint}</p>
      )}
      
      {actionText && onAction && (
        <button className="btn btn-primary trippo-empty-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
      
      {children}
    </div>
  )
}

export default EmptyState