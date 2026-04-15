# Hostinger Deployment Notes

This repo is now structured for a single Node.js app on Hostinger:

- `package.json` is at the repo root.
- Express runs the backend from `backend/src/index.js`.
- Vite builds the frontend into `backend/public`.
- Express serves `backend/public` and keeps `/api/*` on the same origin.

Recommended Hostinger settings:

- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm start`
- Node version: `20` or newer

Recommended environment variables:

- `DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"`
- `PORT=3000`
- `JWT_SECRET=replace-this`
- `CORS_ORIGIN=https://impexengineering.org,https://www.impexengineering.org`
- `RESEND_API_KEY=...`
- `RESEND_FROM=...`

Prisma on Hostinger:

- Use `npm run prisma:generate` to generate the client.
- Use `npm run prisma:push` to sync the schema to MySQL.
- Do not use `prisma migrate dev` on Hostinger because it needs a shadow database.
- The app can be deployed before the database is attached. `npm run build` does not require a live database.
- Add `DATABASE_URL` when your Hostinger MySQL database is ready, then run `npm run prisma:push`.

Suggested first deploy sequence:

1. Upload the repo.
2. Set the non-database environment variables in Hostinger.
3. Run `npm install`.
4. Run `npm run build`.
5. Start the app with `npm start`.
6. After the MySQL database is created, add `DATABASE_URL`.
7. Run `npm run prisma:push`.

Security-related package changes:

- Removed the separate backend package that included `nodemon`, which was pulling older `picomatch` and `brace-expansion` chains.
- Moved the app to a single root package for deployment.
- Upgraded Express to `^5.1.0` in the deployable manifest so the old Express 4 `path-to-regexp` chain is no longer the intended production dependency.
