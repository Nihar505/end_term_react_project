import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHabits } from '../hooks/useHabits'
import { useHabitStats } from '../hooks/useHabitStats'
import { StreakHeatmap } from '../components/StreakHeatmap'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { format } from 'date-fns'

export default function HabitDetail() {
  const { id } = useParams()
  const { habits, logs, loading, toggleToday } = useHabits()
  const { perHabit } = useHabitStats(habits, logs)

  const habit = useMemo(() => habits.find((h) => h.id === id), [habits, id])
  const habitLogs = useMemo(() => logs.filter((l) => l.habit_id === id), [logs, id])
  const stats = useMemo(() => perHabit.find((s) => s.habit.id === id), [perHabit, id])

  if (loading) return <LoadingSpinner />
  if (!habit) {
    return (
      <div className="rounded-md bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        Habit not found. <Link to="/" className="underline">Back to dashboard</Link>.
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
          ← Dashboard
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white" style={{ color: habit.color }}>
          {habit.name}
        </h1>
        {habit.description ? (
          <p className="mt-1 text-slate-600 dark:text-slate-300">{habit.description}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Current streak" value={`${stats?.streak ?? 0} 🔥`} />
        <Stat label="Last 30 days" value={`${stats?.last30Completed ?? 0}`} />
        <Stat label="Completion rate" value={`${Math.round((stats?.completionRate ?? 0) * 100)}%`} />
        <Stat label="Target / week" value={`${habit.target_per_week}`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Last 12 weeks
        </h2>
        <StreakHeatmap logs={habitLogs} color={habit.color} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => toggleToday(habit.id)}
          className={`rounded-md px-4 py-2 text-sm font-medium ${
            stats?.completedToday
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {stats?.completedToday ? '✓ Done today — undo' : 'Mark done today'}
        </button>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          History
        </h2>
        {habitLogs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No logs yet. Start today.</p>
        ) : (
          <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {[...habitLogs]
              .sort((a, b) => b.logged_at.localeCompare(a.logged_at))
              .slice(0, 30)
              .map((l) => (
                <li key={l.id} className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-slate-800 dark:text-slate-100">{format(new Date(l.logged_at), 'PP')}</span>
                  <span className="text-slate-400">{format(new Date(l.logged_at), 'HH:mm')}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}
