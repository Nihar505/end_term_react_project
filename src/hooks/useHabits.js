import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as habitsService from '../services/habits.service'
import { subDays } from 'date-fns'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const since = subDays(new Date(), 180)
      const [h, l] = await Promise.all([
        habitsService.listHabits(user.id),
        habitsService.listLogs(user.id, { since }),
      ])
      setHabits(h)
      setLogs(l)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addHabit = useCallback(
    async (input) => {
      const created = await habitsService.createHabit(user.id, input)
      setHabits((prev) => [...prev, created])
      return created
    },
    [user]
  )

  const removeHabit = useCallback(async (id) => {
    await habitsService.deleteHabit(id)
    setHabits((prev) => prev.filter((h) => h.id !== id))
    setLogs((prev) => prev.filter((l) => l.habit_id !== id))
  }, [])

  const editHabit = useCallback(async (id, patch) => {
    const updated = await habitsService.updateHabit(id, patch)
    setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)))
    return updated
  }, [])

  const toggleToday = useCallback(
    async (habitId, date = new Date()) => {
      const result = await habitsService.toggleLog(user.id, habitId, date)
      if (result.action === 'removed') {
        setLogs((prev) => prev.filter((l) => l.id !== result.id))
      } else {
        setLogs((prev) => [...prev, result.log])
      }
      return result
    },
    [user]
  )

  return { habits, logs, loading, error, refresh, addHabit, removeHabit, editHabit, toggleToday }
}
