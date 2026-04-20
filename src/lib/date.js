import { format, startOfDay, subDays, differenceInCalendarDays } from 'date-fns'

export const dayKey = (date = new Date()) => format(startOfDay(date), 'yyyy-MM-dd')

export const lastNDays = (n) => {
  const today = startOfDay(new Date())
  return Array.from({ length: n }, (_, i) => subDays(today, n - 1 - i))
}

export const daysBetween = (a, b) => differenceInCalendarDays(startOfDay(a), startOfDay(b))

export const weekdayLabel = (date) => format(date, 'EEE')
export const hourLabel = (date) => format(date, 'HH')
