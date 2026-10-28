# GymTracker

GymTracker is a full-stack workout tracking application built with Next.js, React, TypeScript, Prisma ORM, and MySQL. It helps users manage workouts, schedule training sessions, track progress, and monitor their training history.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Database Migrations](#database-migrations)
- [Baseline SQL](#baseline-sql)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)

## Features

- User registration and authentication
- Protected application routes
- Workout creation and management
- Exercise management and exercise images
- Workout scheduling
- Workout sessions and exercise tracking
- Tracking of repetitions, sets, and duration
- Dashboard with weekly training information
- Workout history
- Progress tracking
- Weight and calorie logging
- MySQL database with Prisma ORM
- Server-side validation with Zod
- Service and repository architecture
- Responsive user interface

## Technology Stack

| Technology | Purpose |
| --- | --- |
| Next.js | Full-stack React framework |
| React | User interface |
| TypeScript | Static typing |
| Prisma ORM | Database access and migrations |
| MySQL / TiDB Cloud | Relational database |
| Zod | Data validation |
| JWT | Authentication tokens |
| Vercel | Application hosting and deployment |
| Vercel Blob | Exercise image storage |

## 📸 Screenshots

### 🏠 Dashboard
![GymTracker Dashboard](./screenshots/Dashboard.png)

### 💪 Exercise Management
![Exercise Management](./screenshots/Exericses.png)

### ⚖️ Weight Tracking
![Weight Tracking](./screenshots/WeightLog.png)

### 🏋️ Workout Details
![Workout Details](./screenshots/Workout-item.png)

## Prerequisites

Install the following before setting up the project:

- Node.js compatible with the project
- npm
- Git
- MySQL or a compatible database
- Access to the GitHub repository

A code editor such as Visual Studio Code is recommended.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dame9785/gym-tracker.git
cd gym-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Add your database connection string:

```dotenv
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
```

Replace the placeholders with the connection details for your local development database.

Do not commit `.env` or any file containing database credentials, API tokens, or secrets to Git.

See [Environment Variables](#environment-variables) for more information.

### 4. Create a local database

Create an empty MySQL database for local development. For example:

```sql
CREATE DATABASE gymtracker_local;
```

Configure `DATABASE_URL` in `.env` to point to this database.

**Important:** Use a local development database for development and testing. Do not point your local environment at the production database unless you have a specific, approved reason to do so.

### 5. Apply database migrations

Run the existing migrations:

```bash
npx prisma migrate deploy
```

This applies pending migrations from `prisma/migrations/` to the database configured by `DATABASE_URL`.

The active migration history has been tested against a clean database, and its resulting schema has been verified against `prisma/schema.prisma`.

### 6. Generate Prisma Client

```bash
npx prisma generate
```

This generates the Prisma Client used by the application.

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

The application requires environment variables for database access and may require additional configuration for authentication, image storage, and deployment.

| Variable or configuration | Purpose |
| --- | --- |
| `DATABASE_URL` | Database connection used by Prisma |
| Authentication secrets | Required if referenced by the application's authentication implementation |
| Vercel Blob configuration | Required for image uploads and storage when used by the application |

Use the exact variable names expected by the application code and deployment configuration.

### Local development

Store local development values in `.env`. Keep this file out of version control.

### Production

Configure production environment variables in the Vercel project settings.

A local `.env.production.local` file is not automatically uploaded to Vercel. Changing a local environment file does not change the environment variables configured in the deployed application.

Never include real credentials in this README.

## Database Setup

The project uses Prisma ORM with a MySQL-compatible database.

The Prisma schema is located at:

```text
prisma/schema.prisma
```

The active migration history is located at:

```text
prisma/migrations/
```

### Check migration status

```bash
npx prisma migrate status
```

This checks the migration history for the database selected by the current environment configuration.

Always verify which database is configured before running database commands.

### Inspect the Prisma schema

After changing `prisma/schema.prisma`, generate SQL representing the current schema without applying it to a database:

```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
```

This generates SQL representing the schema. It does not apply the SQL to a database.

## Database Migrations

All committed database changes must be represented in the active Prisma migration history.

### Creating a migration

After changing `prisma/schema.prisma`, create a migration against the local development database:

```bash
npx prisma migrate dev --name describe_your_change
```

For example:

```bash
npx prisma migrate dev --name add_exercise_description
```

Review the generated SQL in the new directory under `prisma/migrations/`.

Verify that the migration contains the intended changes and does not include unexpected destructive operations.

### Testing a migration

After creating a migration:

1. Review the generated migration SQL.
2. Generate Prisma Client.
3. Run the application locally.
4. Test the affected functionality.
5. Run the production build.

```bash
npx prisma generate
npm run build
```

Commit both the updated `prisma/schema.prisma` and the new migration directory.

### Deploying migrations

Apply approved migrations to the intended database using:

```bash
npx prisma migrate deploy
```

Use `migrate dev` for development and migration creation. Use `migrate deploy` to apply existing migrations in the target environment.

Before deploying a migration:

- Verify the target database.
- Ensure that an appropriate backup exists for important data.
- Review the migration SQL.
- Confirm that the deployment environment has the correct database connection.
- Test the application after deployment.

Do not run `npx prisma migrate reset` against a database containing data that must be preserved.

### Important migration rules

- Keep the complete migration history in `prisma/migrations/`.
- Commit new migration files to Git.
- Do not delete migrations that have already been applied to shared or production databases.
- Do not modify an already-applied migration to represent a new schema change. Create a new migration instead.
- Do not manually apply SQL and then assume Prisma's migration history has been updated.
- Use a separate test database when verifying migration changes.

## Baseline SQL

A separate baseline SQL snapshot is stored in:

```text
prisma/migrations-baseline/
```

The directory contains:

```text
prisma/migrations-baseline/
├── migration_lock.toml
└── 20261027000000_baseline/
    └── migration.sql
```

The baseline snapshot represents the database schema at the time it was generated. It has been compared with the SQL generated from the current Prisma schema, and the files matched during verification.

**The baseline directory is separate from the active Prisma migration history.** Prisma does not automatically apply this snapshot when running:

```bash
npx prisma migrate deploy
```

For a normal fresh installation, use the active migration history in `prisma/migrations/` as described in [Getting Started](#getting-started).

Do not manually apply the baseline SQL and then run the entire existing migration history against the same database without first establishing a proper Prisma baselining procedure. Doing so can cause migration conflicts.

The baseline snapshot is retained as a separate reference and is not a replacement for the active migration history.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and build the Next.js application |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project Structure

The project uses a layered architecture to separate routing, business logic, data access, and validation.

```text
gym-tracker/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── migrations-baseline/
├── public/
│   ├── exercises/
│   └── images/
├── src/
│   ├── app/
│   │   └── api/
│   ├── repositories/
│   ├── services/
│   ├── schemas/
│   ├── types/
│   └── ...
├── .env
├── package.json
└── README.md
```

This is a high-level overview. Exact file and directory names may differ as the project evolves.

### Architectural responsibilities

- **App Router and API routes:** Application pages and server endpoints.
- **Services:** Business logic and orchestration.
- **Repositories:** Database access through Prisma.
- **Schemas:** Input validation, including Zod schemas.
- **Types:** Shared TypeScript types.
- **Prisma:** Database schema and migration history.
- **Public assets and Blob storage:** Exercise images and other static or uploaded media.

## Deployment

The application is deployed using Vercel.

### Deployment checklist

1. Push the approved changes to the GitHub repository.
2. Confirm that the correct branch is connected to Vercel.
3. Configure the required production environment variables in Vercel.
4. Ensure pending Prisma migrations are applied to the intended production database through the approved deployment workflow.
5. Verify that the build succeeds.
6. Open the deployed application and test authentication, dashboard data, workout sessions, and other affected functionality.

A successful application build does not, by itself, prove that the database migration has been applied.

Do not assume that Vercel automatically runs `prisma migrate deploy` unless that behavior has been configured and
