import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname ?? '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Sign in to keep your streak going.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </label>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        No account?{' '}
        <Link to="/signup" className="font-medium text-brand-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}
