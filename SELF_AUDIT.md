# Self-audit against the rubric

Maps every rubric requirement to where the code lives, so an evaluator (or future
me) can verify the claims in seconds.

## 1. Problem statement (15 marks)
- Stated in [README.md](README.md) §1.
- Non-trivial: not a todo clone; delivers behavioral analytics on top of CRUD.

## 2. Mandatory React requirements (20 marks)

### Core (compulsory)
| Requirement | File reference |
| --- | --- |
| Functional components | All files in [src/](src/) |
| Props & composition | [HabitCard.jsx](src/components/HabitCard.jsx), [HabitDetail.jsx](src/pages/HabitDetail.jsx) uses `<Stat>` / `<Card>` |
| `useState` | [Dashboard.jsx](src/pages/Dashboard.jsx), [HabitForm.jsx](src/components/HabitForm.jsx), [Login.jsx](src/pages/Login.jsx) |
| `useEffect` | [AuthContext.jsx](src/context/AuthContext.jsx), [ThemeContext.jsx](src/context/ThemeContext.jsx), [useHabits.js](src/hooks/useHabits.js), [useLocalStorage.js](src/hooks/useLocalStorage.js) |
| Conditional rendering | [Dashboard.jsx](src/pages/Dashboard.jsx) (empty/loading/error branches), [Signup.jsx](src/pages/Signup.jsx) (confirm email state) |
| Lists & keys | [Dashboard.jsx](src/pages/Dashboard.jsx), [StreakHeatmap.jsx](src/components/StreakHeatmap.jsx), [HabitDetail.jsx](src/pages/HabitDetail.jsx) history list |

### Intermediate (required)
| Requirement | File reference |
| --- | --- |
| Lifting state up | [Dashboard.jsx](src/pages/Dashboard.jsx) owns `showForm`, `filter` used by children |
| Controlled components | Every `<input>` / `<select>` / `<textarea>` (see [HabitForm.jsx](src/components/HabitForm.jsx), [Settings.jsx](src/pages/Settings.jsx)) |
| Routing | [App.jsx](src/App.jsx), [main.jsx](src/main.jsx), [ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) |
| Context API | [AuthContext.jsx](src/context/AuthContext.jsx), [ThemeContext.jsx](src/context/ThemeContext.jsx) |

## 3. Advanced React (15 marks)
| Technique | File reference |
| --- | --- |
| `useMemo` | [useHabitStats.js](src/hooks/useHabitStats.js), [Dashboard.jsx](src/pages/Dashboard.jsx), [Analytics.jsx](src/pages/Analytics.jsx) |
| `useCallback` | [useHabits.js](src/hooks/useHabits.js), [Dashboard.jsx](src/pages/Dashboard.jsx), [ThemeContext.jsx](src/context/ThemeContext.jsx) |
| `useRef` | [HabitForm.jsx](src/components/HabitForm.jsx) focus management |
| `React.lazy` + `Suspense` | [App.jsx](src/App.jsx) — Analytics route |
| `React.memo` | [HabitCard.jsx](src/components/HabitCard.jsx) |
| Class ErrorBoundary | [ErrorBoundary.jsx](src/components/ErrorBoundary.jsx) |

## 4. Backend integration (15 marks)
| Requirement | Where |
| --- | --- |
| Auth (sign up / sign in / sign out) | [AuthContext.jsx](src/context/AuthContext.jsx), [Login.jsx](src/pages/Login.jsx), [Signup.jsx](src/pages/Signup.jsx) |
| Protected routes | [ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) |
| Persistent user data | Supabase Postgres — [schema.sql](supabase/schema.sql) |
| CRUD | [habits.service.js](src/services/habits.service.js) — create/read/update/archive/delete |
| Row-level security | Policies in [schema.sql](supabase/schema.sql) |

## 5. UI/UX (10 marks)
- Responsive grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` in [Dashboard.jsx](src/pages/Dashboard.jsx).
- Loading state: [LoadingSpinner.jsx](src/components/LoadingSpinner.jsx).
- Error state: [ErrorBoundary.jsx](src/components/ErrorBoundary.jsx) + inline error messages in [Login.jsx](src/pages/Login.jsx), [HabitForm.jsx](src/components/HabitForm.jsx).
- Dark mode with system-preference default: [ThemeContext.jsx](src/context/ThemeContext.jsx).
- Accessibility: `aria-label` on icon buttons, `role="tablist"` on the filter, `prefers-reduced-motion` honored in [index.css](src/index.css).
- Consistent design tokens: `brand` palette in [tailwind.config.js](tailwind.config.js).

## 6. Code quality (10 marks)
- **Separation of concerns**: pages orchestrate, components render, hooks own stateful logic, services are the single Supabase seam.
- **No premature abstractions**: `<Card>` and `<Stat>` are only extracted where reused.
- **No dead code**: every exported symbol has a caller.
- **Comments only where non-obvious**: e.g. the `last30.length > i ? ...` branch in [useHabitStats.js](src/hooks/useHabitStats.js) is commented because the indexing isn't self-evident.

## 7. Functionality (10 marks)
Smoke test before submission:
- [ ] Sign up → confirm → sign in
- [ ] Create 3 habits with different colors
- [ ] Toggle today on/off for each → state persists across reload
- [ ] Visit `/habits/:id` → heatmap renders
- [ ] Delete a habit → its logs disappear from analytics
- [ ] `/analytics` renders charts with no console errors
- [ ] Dark mode toggle persists across reload
- [ ] Refresh on a deep URL like `/habits/<id>` still works (Vercel / local preview)
- [ ] Lighthouse mobile score ≥ 90 on the dashboard

## 8. Demo & explanation (5 marks)
- Script at [DEMO_SCRIPT.md](DEMO_SCRIPT.md), timed to 5 minutes.
- Every claim in the script maps to a real file I can open.
