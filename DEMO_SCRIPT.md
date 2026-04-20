# Demo video script — Habitly

**Target length:** 3–5 minutes. Record at 1080p with system audio muted; narrate
through a decent mic. Show the browser full-screen.

---

## Section 1 — The problem (0:00 – 0:30)

> "Most habit trackers tell you *if* you did a habit. They don't tell you *when*
> you actually do it. I built Habitly to answer that second question, because
> behavioral research says context cues drive habits more than willpower. If you
> can see that you log 94% on Tuesdays and 21% on Fridays, you can schedule around
> your real behavior instead of your aspirations."

*B-roll:* Dashboard already populated with ~5 habits and a few weeks of data.
Seed a few accounts beforehand so the analytics page has something to show.

---

## Section 2 — Auth + protected routes (0:30 – 1:00)

1. Sign out.
2. Try to visit `/analytics` directly → redirected to `/login`.
3. Sign in → land back on `/analytics` (the `from` state in `ProtectedRoute`).

> "Routes are guarded by a ProtectedRoute component that reads from AuthContext.
> The context subscribes to Supabase's `onAuthStateChange` so the UI stays in
> sync if the session expires in another tab."

---

## Section 3 — CRUD (1:00 – 2:00)

1. Create a habit: "Morning pages", color blue, target 5 days/week.
2. Toggle today's log — watch the card flip to the "done" state.
3. Toggle again — undo works (optimistic update, then Supabase delete).
4. Click into the habit → detail page shows the heatmap.
5. Delete a different habit from the card — confirm prompt, it disappears.

> "Every write goes through a services layer. The hook calls the service, then
> updates local state so there's no refetch round-trip. Row-level security
> policies on the Supabase side mean a user can only ever see or mutate their
> own rows."

---

## Section 4 — Analytics + insights (2:00 – 3:00)

1. Navigate to `/analytics` — mention "this route is lazy-loaded; Recharts only
   downloads when you land here."
2. Point at the weekday bar chart → "this user is most consistent on Wednesdays."
3. Point at the hour-of-day chart → "most logs happen around 21:00."
4. Read the English insight bullets above the charts.

> "The insights are derived in a `useMemo` inside `useHabitStats` so they only
> recompute when habits or logs actually change."

---

## Section 5 — UX polish (3:00 – 3:40)

1. Toggle dark mode (persists across reload).
2. Resize to mobile width — grid collapses to one column, nav stays readable.
3. Filter tabs: All / Pending / Done.
4. Trigger the empty state (by deleting everything in a disposable account) to
   show the zero-data experience.

---

## Section 6 — Code tour (3:40 – 4:40)

Open the editor to these files in order:

1. `src/context/AuthContext.jsx` — "useMemo on the context value to avoid
   re-rendering every consumer when unrelated state changes."
2. `src/hooks/useHabits.js` — "single source of truth for habits + logs; exposes
   CRUD callbacks wrapped in `useCallback`."
3. `src/hooks/useHabitStats.js` — "expensive derivation memoized once; consumed
   by Dashboard, HabitDetail, and Analytics."
4. `src/App.jsx` — "lazy Analytics, ErrorBoundary around the Suspense boundary
   so a broken chart doesn't white-screen the app."
5. `supabase/schema.sql` — "unique constraint on (habit_id, day_key) is what
   makes 'toggle today' idempotent, and the RLS policies are what makes this
   multi-tenant-safe."

---

## Section 7 — Wrap (4:40 – 5:00)

> "Stack: Vite, React 18, React Router, Supabase, Tailwind. Deployed on Vercel.
> Code is on GitHub — link in the description. Thanks for watching."

---

## Recording checklist

- [ ] Seed two test accounts (one empty, one populated) so you can show both
      states without live data-entry.
- [ ] Zoom terminal / editor font to ~18pt.
- [ ] Close any notification-heavy apps (Slack, Mail).
- [ ] Record a throwaway take first to warm up.
- [ ] Final edit should cut any >2-second pauses.
