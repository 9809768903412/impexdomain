ImpexLink deployment notes now support two layouts:

1. Single app deploy:
- Backend + frontend on one Node host
- Use `npm run build` and `npm start`

2. Split deploy:
- Frontend on Hostinger static hosting
- Backend + database on Railway
- Use `npm run build:frontend` for the frontend artifact

Important frontend environment variable:
- `VITE_API_URL=https://your-railway-service.up.railway.app/api`

Important backend environment variables:
- `DATABASE_URL=...`
- `PORT=3000`
- `JWT_SECRET=...`
- `CORS_ORIGIN=https://impexengineering.org,https://www.impexengineering.org`
- `RESEND_API_KEY=...`
- `RESEND_FROM=...`

This repo is currently configured for PostgreSQL via Prisma.

For the full split deploy checklist, see `RAILWAY_HOSTINGER_DEPLOY.md`.
