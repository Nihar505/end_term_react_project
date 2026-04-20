import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-100 text-brand-700 dark:bg-brand-700/30 dark:text-brand-100'
      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
  }`

export function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700" />
          Habitly
        </NavLink>

        {user ? (
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
            <NavLink to="/analytics" className={linkClass}>Analytics</NavLink>
            <NavLink to="/settings" className={linkClass}>Settings</NavLink>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="ml-2 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <button
              onClick={handleSignOut}
              className="ml-1 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Sign out
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink
              to="/signup"
              className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Sign up
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}
