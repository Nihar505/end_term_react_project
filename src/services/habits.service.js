import { supabase } from '../lib/supabase'
import { dayKey } from '../lib/date'

export async function listHabits(userId) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createHabit(userId, { name, description, color, targetPerWeek }) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name,
      description: description ?? null,
      color: color ?? '#6366f1',
      target_per_week: targetPerWeek ?? 7,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateHabit(id, patch) {
  const { data, error } = await supabase
    .from('habits')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function archiveHabit(id) {
  return updateHabit(id, { archived_at: new Date().toISOString() })
}

export async function deleteHabit(id) {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw error
}

export async function listLogs(userId, { since } = {}) {
  let query = supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: true })
  if (since) query = query.gte('logged_at', since.toISOString())
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function toggleLog(userId, habitId, date = new Date(), note) {
  const key = dayKey(date)
  const { data: existing, error: exErr } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('day_key', key)
    .maybeSingle()
  if (exErr) throw exErr

  if (existing) {
    const { error } = await supabase.from('habit_logs').delete().eq('id', existing.id)
    if (error) throw error
    return { action: 'removed', id: existing.id }
  }

  const { data, error } = await supabase
    .from('habit_logs')
    .insert({
      user_id: userId,
      habit_id: habitId,
      day_key: key,
      logged_at: date.toISOString(),
      note: note ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return { action: 'added', log: data }
}
