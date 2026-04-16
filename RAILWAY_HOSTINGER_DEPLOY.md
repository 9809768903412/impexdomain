# Split Deployment: Frontend on Hostinger, Backend + Database on Railway

This repo can now be deployed in a split setup:

- Hostinger serves the static frontend.
- Railway runs the Express API.
- Railway PostgreSQL stores the data.

## Frontend on Hostinger

Use these settings or their equivalent:

- Root directory: `./`
- Install command: `npm install`
- Build command: `npm run build:frontend`
- Publish directory: `frontend/dist`

If Hostinger only supports uploading built files, generate the artifact locally with:

```bash
npm run build:frontend
```

Then upload the contents of `frontend/dist`.

Frontend environment variable:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

## Backend on Railway

Use the repo root for the backend service.

Recommended Railway service settings:

- Start command: `npm start`

Railway can usually detect the Node app without a custom build command. If you want it explicit, use:

```bash
npm install && npm run prisma:generate
```

Backend environment variables:

```env
DATABASE_URL=mysql://...
PORT=3000
JWT_SECRET=replace-this-with-a-long-random-secret
CORS_ORIGIN=https://impexengineering.org,https://www.impexengineering.org
RESEND_API_KEY=...
RESEND_FROM=...
```

## Railway PostgreSQL

1. Create a PostgreSQL database service in Railway.
2. Copy Railway's generated `DATABASE_URL`.
3. Add that `DATABASE_URL` to the backend service variables.
4. Redeploy the backend service.

If the schema has not been created yet, run:

```bash
npm run prisma:push
```

Use Railway's shell/command runner for that step.

## Verification

After the backend deploys:

- Open `https://your-railway-backend.up.railway.app/health`
- It should return `{"status":"ok"}`

After the frontend deploys:

- Open `https://impexengineering.org`
- The frontend should load and send API requests to Railway

## Notes

- The frontend now supports a standalone build output via `npm run build:frontend`.
- When `VITE_API_URL` is set, the frontend will call the Railway backend directly.
- The backend CORS configuration expects your Hostinger domain in `CORS_ORIGIN`.
- Prisma is configured to use PostgreSQL in `backend/prisma/schema.prisma`.
