import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null) // 'ok' | 'confirm'
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    const { data, error } = await signUp(email, password)
    setLoading(false)
    if (error) {
      setErr(error.message)
      return
    }
    // If email confirmation is required, Supabase returns a user with no session.
    if (data?.session) {
      navigate('/', { replace: true })
    } else {
      setStatus('confirm')
    }
  }

  if (status === 'confirm') {
    return (
      <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Check your inbox</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          We sent a confirmation link to <strong>{email}</strong>. Click it, then sign in.
        </p>
        <Link to="/login" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-16 max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Create account</h1>
      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Start tracking in under a minute.</p>

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
          <span className="mt-1 block text-xs text-slate-400">Minimum 6 characters.</span>
        </label>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have one?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
