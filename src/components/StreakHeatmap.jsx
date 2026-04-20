import { useMemo } from 'react'
import { dayKey, lastNDays } from '../lib/date'
import { format } from 'date-fns'

// Renders a 7-row x N-week heatmap of the last `days` (default 84 = 12 weeks).
export function StreakHeatmap({ logs, color = '#6366f1', days = 84 }) {
  const cells = useMemo(() => {
    const byDay = new Set(logs.map((l) => l.day_key))
    return lastNDays(days).map((d) => ({
      date: d,
      key: dayKey(d),
      done: byDay.has(dayKey(d)),
    }))
  }, [logs, days])

  // Group into weeks of 7 for a grid layout.
  const weeks = useMemo(() => {
    const out = []
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
    return out
  }, [cells])

  return (
    <div className="flex gap-1 overflow-x-auto" role="img" aria-label="Activity heatmap">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((cell) => (
            <div
              key={cell.key}
              title={`${format(cell.date, 'PP')} — ${cell.done ? 'done' : 'missed'}`}
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor: cell.done ? color : 'rgba(100,116,139,0.18)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
