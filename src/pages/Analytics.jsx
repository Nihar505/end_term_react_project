import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useHabits } from '../hooks/useHabits'
import { useHabitStats } from '../hooks/useHabitStats'
import { LoadingSpinner } from '../components/LoadingSpinner'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Analytics() {
  const { habits, logs, loading } = useHabits()
  const { weekdayCounts, hourCounts, perHabit, totalLogs } = useHabitStats(habits, logs)

  const weekdayData = useMemo(
    () => weekdayCounts.map((c, i) => ({ day: WEEKDAYS[i], logs: c })),
    [weekdayCounts]
  )

  const hourData = useMemo(
    () => hourCounts.map((c, i) => ({ hour: `${String(i).padStart(2, '0')}h`, logs: c })),
    [hourCounts]
  )

  // Insights are built as React fragments (not HTML strings) so user-supplied
  // habit names can never escape into markup.
  const insights = useMemo(() => {
    const list = []
    const topDayIdx = weekdayCounts.indexOf(Math.max(...weekdayCounts))
    if (weekdayCounts[topDayIdx] > 0) {
      list.push(
        <>
          You're most consistent on <strong>{WEEKDAYS[topDayIdx]}s</strong>.
        </>
      )
    }
    const topHourIdx = hourCounts.indexOf(Math.max(...hourCounts))
    if (hourCounts[topHourIdx] > 0) {
      list.push(
        <>
          Most logs happen around <strong>{String(topHourIdx).padStart(2, '0')}:00</strong>.
        </>
      )
    }
    const best = [...perHabit].sort((a, b) => b.completionRate - a.completionRate)[0]
    if (best && best.completionRate > 0) {
      list.push(
        <>
          Your strongest habit is <strong>{best.habit.name}</strong> (
          {Math.round(best.completionRate * 100)}% / 30d).
        </>
      )
    }
    const weakest = [...perHabit]
      .filter((s) => s.completionRate < 0.4)
      .sort((a, b) => a.completionRate - b.completionRate)[0]
    if (weakest) {
      list.push(
        <>
          <strong>{weakest.habit.name}</strong> is slipping — only{' '}
          {Math.round(weakest.completionRate * 100)}% in the last 30 days.
        </>
      )
    }
    return list
  }, [weekdayCounts, hourCounts, perHabit])

  if (loading) return <LoadingSpinner />

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {totalLogs} logs across {habits.length} habits.
        </p>
      </div>

      {insights.length > 0 ? (
        <ul className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          {insights.map((node, i) => (
            <li key={i} className="text-slate-700 dark:text-slate-200">
              {node}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="By weekday">
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="logs" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="By hour of day">
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="hour" interval={2} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="logs" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      {children}
    </div>
  )
}
