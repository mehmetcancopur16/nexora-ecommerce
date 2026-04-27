# Nexora E-Commerce Platform

Nexora, React + Vite frontend ile Node.js + Express + MongoDB backend'i ayni monorepo icinde calistiran full-stack e-commerce platformudur.

## Project Structure

- `ecommerce-frontend`: Storefront + profile + admin UI
- `ecommerce-backend`: REST API, auth, business logic, Swagger, seeder

## Architecture Overview

- Frontend, `axios` ile backend API'lerine baglanir.
- Backend, JWT bearer auth + role kontrolu ile endpoint'leri korur.
- Tüm domain verisi MongoDB/Mongoose uzerinden yonetilir.
- Swagger spec runtime'da uretilir ve `/api-docs` altinda sunulur.

## Requirements

- Node.js 20+ (recommended LTS)
- npm 10+
- MongoDB instance (local or remote)

## Installation

```bash
npm install
cd ecommerce-backend && npm install
cd ../ecommerce-frontend && npm install
```

## Environment Setup

### Backend

```bash
cd ecommerce-backend
cp .env.example .env
```

Required core variables:

- `PORT` (default `5000`)
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`
- `CORS_ORIGINS`

### Frontend

```bash
cd ecommerce-frontend
cp .env.example .env
```

Important variables:

- `VITE_API_BASE_URL=http://localhost:5000/api`
- `VITE_AUTH_LOGIN_PATH` (optional)
- `VITE_AUTH_REGISTER_PATH` (optional)

## Development

Run frontend + backend together from repository root:

```bash
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api-docs`

## Seeding and Test Dataset

Comprehensive E2E dataset commands:

```bash
npm run seed
npm run seed:e2e
npm run seed:safe
```

Seeder details: `ecommerce-backend/SEEDING.md`

## API Documentation

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`
- Health: `http://localhost:5000/api/health`

Route-level details: `ecommerce-backend/API.md`

## Quality and Testing Status

- Frontend quality gate: `npm run lint` + `npm run build`
- Backend quality gate: syntax/runtime checks + API smoke tests
- Automated backend/frontend test suites are currently placeholder-level in package scripts; smoke-driven verification is used.

## Deployment Notes

- Build frontend with `npm run build` in `ecommerce-frontend`.
- Run backend with `npm start` in `ecommerce-backend`.
- Ensure reverse proxy/CORS configuration matches production domains.
- Keep `JWT_SECRET` and DB credentials in secure secret storage.

## Troubleshooting

- Frontend cannot reach API:
  - Verify `VITE_API_BASE_URL` points to backend host/port (`5000` by default).
- `MONGO_URI` errors:
  - Confirm `.env` exists in backend and MongoDB is reachable.
- Auth suddenly invalid:
  - Token invalidation is expected after `JWT_SECRET` changes; login again.
- Port collision (`EADDRINUSE`):
  - Stop conflicting process or update `PORT`.
