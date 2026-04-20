import { useCallback, useMemo, useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useHabitStats } from '../hooks/useHabitStats'
import { HabitCard } from '../components/HabitCard'
import { HabitForm } from '../components/HabitForm'
import { LoadingSpinner } from '../components/LoadingSpinner'

export default function Dashboard() {
  const { habits, logs, loading, error, addHabit, removeHabit, toggleToday } = useHabits()
  const { perHabit } = useHabitStats(habits, logs)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'done'

  const statsByHabit = useMemo(() => {
    const m = new Map()
    perHabit.forEach((s) => m.set(s.habit.id, s))
    return m
  }, [perHabit])

  const visible = useMemo(() => {
    if (filter === 'all') return habits
    if (filter === 'done') return habits.filter((h) => statsByHabit.get(h.id)?.completedToday)
    return habits.filter((h) => !statsByHabit.get(h.id)?.completedToday)
  }, [habits, filter, statsByHabit])

  const handleDelete = useCallback(
    async (id) => {
      const ok = window.confirm('Delete this habit and all its logs? This cannot be undone.')
      if (!ok) return
      await removeHabit(id)
    },
    [removeHabit]
  )

  const todaysProgress = useMemo(() => {
    const done = perHabit.filter((s) => s.completedToday).length
    return { done, total: habits.length }
  }, [perHabit, habits.length])

  if (loading) return <LoadingSpinner label="Loading your habits…" />
  if (error) {
    return (
      <p className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-950/40 dark:text-red-200">
        Couldn't load habits: {error.message}
      </p>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Today</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {todaysProgress.done} of {todaysProgress.total} done
            {todaysProgress.total > 0
              ? ` (${Math.round((todaysProgress.done / todaysProgress.total) * 100)}%)`
              : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            role="tablist"
            aria-label="Filter habits"
            className="flex rounded-md border border-slate-200 bg-white p-0.5 text-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {['all', 'pending', 'done'].map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded px-2.5 py-1 capitalize ${
                  filter === f
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            {showForm ? 'Close' : '+ New habit'}
          </button>
        </div>
      </div>

      {showForm ? <HabitForm onSubmit={addHabit} onCancel={() => setShowForm(false)} /> : null}

      {habits.length === 0 ? (
        <EmptyState onCreate={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((h) => (
            <HabitCard
              key={h.id}
              habit={h}
              stats={statsByHabit.get(h.id)}
              onToggleToday={toggleToday}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">No habits yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Start with one small, daily habit. The smaller it is, the more likely you'll do it tomorrow.
      </p>
      <button
        onClick={onCreate}
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Create your first habit
      </button>
    </div>
  )
}
