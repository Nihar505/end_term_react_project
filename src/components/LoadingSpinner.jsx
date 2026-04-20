export function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center gap-3 p-10 text-slate-500 dark:text-slate-400">
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  )
}
