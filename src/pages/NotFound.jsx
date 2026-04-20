import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">404</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">That page doesn't exist.</p>
      <Link to="/" className="mt-4 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
        Back to dashboard
      </Link>
    </div>
  )
}
