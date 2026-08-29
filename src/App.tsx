import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthProvider'
import { Browse } from './pages/Browse'
import { CreateListing } from './pages/CreateListing'
import { Home } from './pages/Home'
import { HowItWorks } from './pages/HowItWorks'
import { Impact } from './pages/Impact'
import { ListingDetail } from './pages/ListingDetail'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="browse" element={<Browse />} />
            <Route path="listings/new" element={
              <ProtectedRoute>
                <CreateListing />
              </ProtectedRoute>
            } />
            <Route path="listings/:id" element={<ListingDetail />} />
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
