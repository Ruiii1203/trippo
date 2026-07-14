import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useTripStore } from './stores/useTripStore'
import TripListPage from './pages/trip/TripListPage'
import CreateTripPage from './pages/trip/CreateTripPage'
import TripDetailPage from './pages/trip/TripDetailPage'
import SpotSearchPage from './pages/spot/SpotSearchPage'
import WishlistPage from './pages/spot/WishlistPage'
import GlobalWishlistPage from './pages/spot/GlobalWishlistPage'
import SpotDetailPage from './pages/spot/SpotDetailPage'
import RoutePage from './pages/route/RoutePage'
import CheckInEditPage from './pages/checkin/CheckInEditPage'
import CheckInListPage from './pages/checkin/CheckInListPage'
import JournalListPage from './pages/journal/JournalListPage'
import GlobalJournalListPage from './pages/journal/GlobalJournalListPage'
import JournalDetailPage from './pages/journal/JournalDetailPage'
import JournalEditorPage from './pages/journal/JournalEditorPage'
import ListListPage from './pages/list/ListListPage'
import ListDetailPage from './pages/list/ListDetailPage'
import BottomNav from './components/BottomNav'
import { ToastProvider } from './components/Toast'

function getShowTabBar(pathname: string): boolean {
  const showTabBarPaths = ['/trips', '/wishlist', '/journals', '/lists']
  return showTabBarPaths.some((path) => pathname === path)
}

function App() {
  const location = useLocation()
  const showTabBar = getShowTabBar(location.pathname)
  return (
    <ToastProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="/trips" element={<TripListPage />} />
          <Route path="/trips/create" element={<CreateTripPage />} />
          <Route path="/trips/:tripId/edit" element={<CreateTripPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
          <Route path="/trips/:tripId/spots/search" element={<SpotSearchPage />} />
          <Route path="/trips/:tripId/spots/wishlist" element={<WishlistPage />} />
          <Route path="/trips/:tripId/spots/:spotId" element={<SpotDetailPage />} />
          <Route path="/trips/:tripId/route" element={<RoutePage />} />
          <Route path="/trips/:tripId/checkins" element={<CheckInListPage />} />
          <Route path="/trips/:tripId/checkin/:spotId/edit" element={<CheckInEditPage />} />
          <Route path="/trips/:tripId/journals" element={<JournalListPage />} />
          <Route path="/trips/:tripId/journals/new" element={<JournalEditorPage />} />
          <Route path="/trips/:tripId/journals/:journalId/edit" element={<JournalEditorPage />} />
          <Route path="/trips/:tripId/journal/:journalId" element={<JournalDetailPage />} />
          <Route path="/journals/new" element={<JournalEditorPage />} />
          <Route path="/journals/:journalId/edit" element={<JournalEditorPage />} />
          <Route path="/wishlist" element={<GlobalWishlistPage />} />
          <Route path="/wishlist/:spotId" element={<SpotDetailPage />} />
          <Route path="/journals" element={<GlobalJournalListPage />} />
          <Route path="/lists" element={<ListListPage />} />
          <Route path="/lists/:listId" element={<ListDetailPage />} />
        </Routes>
        {showTabBar && <BottomNav />}
      </div>
    </ToastProvider>
  )
}

export default App
