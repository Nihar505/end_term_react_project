import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import HabitDetail from './pages/HabitDetail'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Analytics pulls in Recharts — load it only when the route is visited.
const Analytics = lazy(() => import('./pages/Analytics'))

export default function App() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits/:id"
                element={
                  <ProtectedRoute>
                    <HabitDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
