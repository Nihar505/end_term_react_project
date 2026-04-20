import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [reminders, setReminders] = useLocalStorage('habitly:reminders', {
    enabled: false,
    hour: 20,
  })

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>

      <Card title="Account">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Signed in as <strong>{user?.email}</strong>
        </p>
      </Card>

      <Card title="Appearance">
        <div className="flex gap-2">
          {['light', 'dark'].map((opt) => (
            <button
              key={opt}
              onClick={() => setTheme(opt)}
              className={`rounded-md border px-3 py-1.5 text-sm capitalize ${
                theme === opt
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Evening nudge (local only)">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={reminders.enabled}
            onChange={(e) => setReminders({ ...reminders, enabled: e.target.checked })}
          />
          Remind me to check in at{' '}
          <select
            value={reminders.hour}
            onChange={(e) => setReminders({ ...reminders, hour: Number(e.target.value) })}
            className="rounded border border-slate-300 bg-white px-1 py-0.5 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </label>
        <p className="mt-2 text-xs text-slate-400">
          Stored in your browser; no push notifications are sent.
        </p>
      </Card>
    </section>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </h2>
      {children}
    </div>
  )
}
