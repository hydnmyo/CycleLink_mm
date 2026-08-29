import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import { Alerts } from './pages/Alerts'
import { Browse } from './pages/Browse'
import { BrowseWanted } from './pages/BrowseWanted'
import { CreateListing } from './pages/CreateListing'
import { CreateWanted } from './pages/CreateWanted'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { Impact } from './pages/Impact'
import { Inbox } from './pages/Inbox'
import { ListingDetail } from './pages/ListingDetail'
import { Login } from './pages/Login'
import { MyListings } from './pages/MyListings'
import { Signup } from './pages/Signup'
import { WantedDetail } from './pages/WantedDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="browse" element={<Browse />} />
            <Route path="wanted" element={<BrowseWanted />} />
            <Route path="wanted/new" element={
              <ProtectedRoute>
                <CreateWanted />
              </ProtectedRoute>
            } />
            <Route path="wanted/:id" element={<WantedDetail />} />
            <Route path="alerts" element={
              <ProtectedRoute>
                <Alerts />
              </ProtectedRoute>
            } />
            <Route path="listings/new" element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } />
            <Route path="listings/:id" element={<ListingDetail />} />
            <Route path="my-listings" element={
              <ProtectedRoute>
                <MyListings />
              </ProtectedRoute>
            } />
            <Route path="inbox" element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            } />
            <Route path="impact" element={<Impact />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
