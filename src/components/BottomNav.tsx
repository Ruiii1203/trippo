import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { id: 'trips', label: '行程', path: '/trips' },
  { id: 'wishlist', label: '心愿单', path: '/wishlist' },
  { id: 'journals', label: '旅行手账', path: '/journals' },
]

function getActiveTab(pathname: string): string {
  if (pathname.startsWith('/wishlist')) return 'wishlist'
  if (pathname.includes('/spots/wishlist')) return 'wishlist'
  if (pathname.startsWith('/journals')) return 'journals'
  if (pathname.includes('/journal/')) return 'journals'
  if (pathname.startsWith('/trips')) return 'trips'
  return 'trips'
}

function BottomNav() {
  const location = useLocation()
  const activeTab = getActiveTab(location.pathname)

  const isActive = (tabId: string) => tabId === activeTab

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          className={`bottom-nav-item ${isActive(tab.id) ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">
            {tab.id === 'trips' && (
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill={isActive(tab.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            )}
            {tab.id === 'wishlist' && (
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill={isActive(tab.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isActive(tab.id) ? (
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                ) : (
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                )}
              </svg>
            )}
            {tab.id === 'journals' && (
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill={isActive(tab.id) ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            )}
          </div>
          <span className="bottom-nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNav