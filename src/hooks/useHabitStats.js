import { useMemo } from 'react'
import { dayKey, lastNDays } from '../lib/date'

// Derives per-habit streaks, completion rates, and weekday/hour breakdowns.
// Kept in a hook so useMemo caches between re-renders of the Dashboard/Analytics pages.
export function useHabitStats(habits, logs) {
  return useMemo(() => {
    const logsByHabit = new Map()
    for (const log of logs) {
      if (!logsByHabit.has(log.habit_id)) logsByHabit.set(log.habit_id, [])
      logsByHabit.get(log.habit_id).push(log)
    }

    const todayKey = dayKey()
    const last30 = lastNDays(30).map(dayKey)

    const perHabit = habits.map((habit) => {
      const habitLogs = logsByHabit.get(habit.id) ?? []
      const logKeys = new Set(habitLogs.map((l) => l.day_key))

      let streak = 0
      for (let i = 0; i < 365; i++) {
        const k = last30.length > i ? last30[last30.length - 1 - i] : dayKey(new Date(Date.now() - i * 86400000))
        if (logKeys.has(k)) streak += 1
        else break
      }

      const last30Completed = last30.filter((k) => logKeys.has(k)).length
      const completionRate = last30.length ? last30Completed / last30.length : 0

      return {
        habit,
        streak,
        completedToday: logKeys.has(todayKey),
        last30Completed,
        completionRate,
      }
    })

    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0] // Sun..Sat
    const hourCounts = Array.from({ length: 24 }, () => 0)
    for (const log of logs) {
      const d = new Date(log.logged_at)
      weekdayCounts[d.getDay()] += 1
      hourCounts[d.getHours()] += 1
    }

    return { perHabit, weekdayCounts, hourCounts, totalLogs: logs.length }
  }, [habits, logs])
}
