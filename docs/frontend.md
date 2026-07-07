# Frontend

Built with React 19, Vite, Tailwind CSS, and Framer Motion.

---

## Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| Tailwind CSS | 4 | Styling |
| Framer Motion | 11 | Animations |
| React Router | 6 | Client-side routing |
| Axios | 1 | HTTP client |
| TanStack Query | 5 | Server state |
| React Hook Form | 7 | Form handling |
| Zod | 3 | Validation |

---

## Folder Structure

```
frontend/src/
├── App.jsx                  # Root routes
├── main.jsx                 # Entry point with providers
├── index.css                # Global styles + Tailwind
│
├── components/
│   ├── landing/             # Landing page sections
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   └── Footer.jsx
│   └── ProtectedRoute.jsx   # Auth guard
│
├── layouts/
│   └── DashboardLayout.jsx  # Topbar + nav wrapper
│
├── pages/
│   ├── landing/
│   │   └── Landing.jsx      # Public landing page
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── onboarding/
│   │   └── Onboarding.jsx   # Post-register setup flow
│   ├── dashboard/
│   │   └── Dashboard.jsx    # Main dashboard
│   ├── query/
│   │   └── QueryPage.jsx    # NL query interface
│   ├── schema/
│   │   └── SchemaExplorer.jsx
│   ├── saved/
│   │   └── SavedDashboards.jsx
│   ├── reports/
│   │   └── Reports.jsx
│   ├── audit/
│   │   └── AuditLogs.jsx
│   ├── connect/
│   │   └── ConnectDatabase.jsx
│   ├── settings/
│   │   └── Settings.jsx
│   └── NotFound.jsx
│
├── services/                # API layer
│   ├── api.js               # Axios instance + interceptors
│   ├── auth.service.js
│   ├── organization.service.js
│   ├── database.service.js
│   └── query.service.js
│
└── store/
    └── AuthContext.jsx      # Global auth state
```

---

## Routing

```
/                    → Landing (public)
/login               → Login (public)
/register            → Register (public)
/onboarding          → Onboarding (public, post-register)

Protected routes (requires JWT):
/query               → Query page (default after login)
/dashboard           → Dashboard
/schema              → Schema Explorer
/saved               → Saved Dashboards
/reports             → Reports
/audit               → Audit Logs
/connect             → Connect Database
/settings            → Settings

*                    → 404 Not Found
```

---

## Auth Context

`src/store/AuthContext.jsx` provides global auth state.

```jsx
import { useAuth } from '../store/AuthContext'

const { user, organization, login, register, logout } = useAuth()
```

**State:**
- `user` — current user object or null
- `organization` — current org object or null
- `loading` — true while checking localStorage on mount

**Methods:**
- `login(email, password)` — calls API, stores token, navigates to /dashboard
- `register(name, email, password, orgName)` — calls API, navigates to /onboarding
- `logout()` — clears localStorage, navigates to /login

Token is stored in `localStorage` under `token`.

---

## API Service Layer

`src/services/api.js` is the base Axios instance.

- Automatically attaches `Authorization: Bearer <token>` to every request
- On 401 response → clears localStorage and redirects to /login

```js
import api from '../services/api'

// GET request
const data = await api.get('/organization')

// POST request
const data = await api.post('/queries/run', { question, connectionId })
```

Individual service files wrap specific endpoints:

```js
import { runQuery, getQueryHistory } from '../services/query.service'
import { getConnections, getConnectionSchema } from '../services/database.service'
import { getMembers, inviteMember } from '../services/organization.service'
```

---

## Design System

### Colors
- Background: `black` / `zinc-950`
- Borders: `zinc-900` / `zinc-800`
- Text primary: `white`
- Text secondary: `zinc-400` / `zinc-500`
- Text muted: `zinc-600` / `zinc-700`
- Accent: `white` buttons, `emerald-400` for success states

### Typography
- Font: `Inter` (UI) + `DM Mono` (code/mono)
- Imported from Google Fonts in `index.html`

### Component Patterns

**Cards:**
```jsx
<div className="border border-zinc-900 rounded-2xl p-6">
```

**Inputs:**
```jsx
<input className="w-full bg-black border border-zinc-800 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600 transition-colors" />
```

**Primary button:**
```jsx
<button className="bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors">
```

**Secondary button:**
```jsx
<button className="text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 px-4 py-2 rounded-lg transition-colors">
```

### Animations
All pages use Framer Motion for:
- Page entry: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- Hover effects: `whileHover={{ scale: 1.02 }}`
- Exit animations with `AnimatePresence`
- Scroll-triggered with `useInView`

---

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

Access in code:
```js
import.meta.env.VITE_API_URL
```

---

## Known Issues

- [ ] Hamburger menu position on QueryPage is inconsistent — tracked in [GitHub Issue #2]
- [ ] Mobile nav not fully implemented in DashboardLayout