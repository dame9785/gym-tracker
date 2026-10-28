Run the following command to apply the existing migrations to the database:

```bash
npx prisma migrate deploy
```

This applies migrations from `prisma/migrations` in chronological order. The active migration history has been tested against a clean database, and its resulting schema has been verified against `prisma/schema.prisma`.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Migrations

The active Prisma migration directory is:

```text
prisma/migrations/
```

### Creating a migration

After changing `prisma/schema.prisma`, create and test a migration against your local development database:

```bash
npx prisma migrate dev --name describe_your_change
```

Review the generated migration SQL and test the application before committing the changes.

### Deploying migrations

Apply approved migrations to the intended database using:

```bash
npx prisma migrate deploy
```

For production, configure the database connection through your deployment platform's environment variables. Vercel uses its configured environment variables; a local `.env.production.local` file is not automatically uploaded to Vercel.

Always verify the target database and back up any database containing data that must be preserved.

Never run `npx prisma migrate reset` on a database containing data that must be preserved.

## Baseline SQL

A separate baseline SQL snapshot is stored under:

```text
prisma/migrations-baseline/
```

This snapshot has been tested against a separate database, and its schema matches `prisma/schema.prisma`.

The baseline directory is not the active Prisma migration directory. It is not applied by `npx prisma migrate deploy`.

For a normal fresh installation, use the active migrations as described above.

Do not manually apply the baseline SQL and then run the full migration history against the same database without first establishing a proper Prisma baseline procedure. Doing so can cause migration conflicts.

Existing databases must retain their migration history in `prisma/migrations`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and build the Next.js application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Features

- Workout management
- Workout scheduling
- Dashboard with weekly overview
- Workout session tracking
- Progress tracking
- Protected routes and authentication
- MySQL database with Prisma ORM
- API endpoints
- Service and repository architecture
- Responsive user interface

## Architecture

The application follows a layered architecture separating API routes, services, repositories and data models.

```text
app/
  api/
    auth/
    workouts/
    workout-sessions/
  dashboard/
  login/
  register/

services-server/
repositories/
types/
schemas/
prisma/
  schema.prisma
  migrations/
  migrations-baseline/
```

## Screenshots

<p align="center">
  <img src="./screenshots/Dashboard.png" width="48%" />
  <img src="./screenshots/WeightLog.png" width="48%" />
</p>

<p align="center">
  <img src="./screenshots/Exericses.png" width="48%" />
  <img src="./screenshots/Workout-item.png" width="48%" />
</p>