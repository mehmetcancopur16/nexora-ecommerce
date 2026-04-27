# Nexora Frontend

Nexora frontend, storefront + profile + admin panel UI katmanini icerir.

## Stack

- React
- Vite
- React Router
- Zustand
- Axios
- Framer Motion + Lucide icons

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

- `VITE_API_BASE_URL=http://localhost:5000/api`
- `VITE_AUTH_LOGIN_PATH=/auth/login` (optional override)
- `VITE_AUTH_REGISTER_PATH=/auth/register` (optional override)

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Runtime URLs

- Frontend dev server: `http://localhost:5173`
- Expected backend API base: `http://localhost:5000/api`

## Architecture Summary

- API communication is centralized via `src/api/axiosInstance.js`.
- Authentication state is managed by Zustand stores.
- Admin routes are role-protected with route guards.
- UI uses shared common components and motion patterns for consistency.

## Quality Status

- Lint and production build are the main automated checks.
- Full automated E2E suite is not yet configured in this package.
- Project-level smoke tests are run with seeded backend data.

## Troubleshooting

- API requests failing:
  - Verify backend is running and `VITE_API_BASE_URL` matches port `5000`.
- Auth redirect loops:
  - Ensure token storage is valid; clear local/session storage and login again.
- Env updates not reflected:
  - Restart Vite after `.env` changes.
