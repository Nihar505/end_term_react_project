import { memo } from 'react'
import { Link } from 'react-router-dom'

function HabitCardImpl({ habit, stats, onToggleToday, onDelete }) {
  const { streak, completedToday, completionRate, last30Completed } = stats
  const pct = Math.round(completionRate * 100)

  return (
    <article
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
      style={{ borderLeft: `4px solid ${habit.color}` }}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <Link
            to={`/habits/${habit.id}`}
            className="text-base font-semibold text-slate-900 hover:underline dark:text-white"
          >
            {habit.name}
          </Link>
          {habit.description ? (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {habit.description}
            </p>
          ) : null}
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          aria-label={`Delete ${habit.name}`}
          className="rounded-md p-1 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950/40"
        >
          ✕
        </button>
      </header>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Streak</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{streak}🔥</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">30-day</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{last30Completed}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Rate</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{pct}%</dd>
        </div>
      </dl>

      <button
        onClick={() => onToggleToday(habit.id)}
        className={`mt-4 w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
          completedToday
            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
      >
        {completedToday ? '✓ Done today — undo' : 'Mark done today'}
      </button>
    </article>
  )
}

// memo so HabitCard doesn't re-render when unrelated sibling cards toggle.
export const HabitCard = memo(HabitCardImpl)
