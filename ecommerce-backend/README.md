# Nexora Backend

Nexora backend, platformun REST API katmanidir. Kimlik dogrulama, e-commerce domain akislari, admin islemleri ve raporlama burada yonetilir.

## Stack

- Node.js (CommonJS)
- Express
- MongoDB + Mongoose
- Zod request validation
- JWT auth + role-based access
- Swagger/OpenAPI (`swagger-jsdoc`, `swagger-ui-express`)

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

Minimum required:

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/nexora`
- `NODE_ENV=development`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRES_IN=7d`
- `CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`

## Scripts

```bash
npm run dev                    # nodemon development server
npm start                      # production-like start
npm run seed                   # destructive e2e seed (--force)
npm run seed:e2e               # same as seed
npm run seed:safe              # guarded mode (no --force)
npm run backfill:product-images
```

## API and Docs

- Base URL: `http://localhost:5000/api`
- Health: `http://localhost:5000/api/health`
- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

Additional endpoint reference: `API.md`

## Domain Modules

- Auth / Users / Addresses / Password flows
- Categories / Products / Reviews
- Cart / Orders / Coupons
- Admin (dashboard, reports, settings, support inbox)
- Notifications / Payment methods / Returns
- Contact and Newsletter

## Testing and Quality Status

- Lint/test scripts are not yet full automated regression suites.
- Current quality gate relies on validation middleware, API smoke checks, and frontend build/lint checks.
- Seeder-enabled dataset is used for end-to-end manual verification.

## Deployment Notes

- Configure production-safe CORS origins.
- Set secure `JWT_SECRET` + short expiry policy based on environment.
- Keep Mongo connection string and app secrets outside repository.
- Expose `/api-docs` only in trusted environments if needed.

## Troubleshooting

- `MONGO_URI tanimli degil`:
  - Ensure `.env` exists and contains `MONGO_URI`.
- Token/auth issues:
  - `JWT_SECRET` changes invalidate old tokens.
- Seeder safety:
  - Use destructive seeding only on non-production databases.
