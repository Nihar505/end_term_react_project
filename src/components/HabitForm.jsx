import { useRef, useState } from 'react'

const PALETTE = ['#6366f1', '#f97316', '#10b981', '#ec4899', '#0ea5e9', '#eab308']

export function HabitForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PALETTE[0])
  const [targetPerWeek, setTargetPerWeek] = useState(7)
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState(null)
  const nameRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setErr('Give your habit a name.')
      nameRef.current?.focus()
      return
    }
    setSubmitting(true)
    setErr(null)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || null, color, targetPerWeek })
      setName('')
      setDescription('')
      setColor(PALETTE[0])
      setTargetPerWeek(7)
      nameRef.current?.focus()
    } catch (e) {
      setErr(e.message ?? 'Could not save habit.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        New habit
      </h3>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Name</span>
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. 20-minute walk"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          maxLength={80}
        />
      </label>

      <label className="mt-3 block text-sm">
        <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">Description (optional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">Color</span>
          <div className="flex gap-1.5">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                aria-pressed={color === c}
                className={`h-6 w-6 rounded-full transition ${
                  color === c ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-slate-900' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700 dark:text-slate-200">
            Target days / week: <span className="font-semibold">{targetPerWeek}</span>
          </span>
          <input
            type="range"
            min={1}
            max={7}
            value={targetPerWeek}
            onChange={(e) => setTargetPerWeek(Number(e.target.value))}
            className="w-40"
          />
        </label>
      </div>

      {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}

      <div className="mt-4 flex justify-end gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Add habit'}
        </button>
      </div>
    </form>
  )
}
