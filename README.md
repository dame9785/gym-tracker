# 🏋️ GymTracker

```{=html}
<p align="center">
```

`<strong>`{=html}Track your workouts. Measure your progress. Build
strength.`</strong>`{=html}

```{=html}
</p>
```

```{=html}
<p align="center">
```

A full-stack workout tracking application built with Next.js, React,
TypeScript, Prisma and MySQL.

```{=html}
</p>
```

```{=html}
<p align="center">
```

`<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />`{=html}
`<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />`{=html}
`<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />`{=html}
`<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />`{=html}
`<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />`{=html}
`<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />`{=html}

```{=html}
</p>
```

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database and Prisma](#database-and-prisma)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Code quality](#code-quality)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)
- [License](#license)

## Overview

GymTracker is a workout tracking application for planning training,
recording workout sessions and following personal progress over time.

The application is built with Next.js and TypeScript. Prisma provides
database access, while a layered application structure separates
user-interface code, business logic and data access.

## Features

### Accounts and authentication

- User registration and login
- JWT-based authentication
- Protected application routes
- Password changes and password reset
- Token versioning for session invalidation

### Workouts and exercises

- Create, edit and manage workouts
- Add exercises and configure sets, repetitions, weights and duration
- Organize exercises within a workout
- Create and manage personal exercises
- Add exercise descriptions, instructions and images
- Record equipment and primary/secondary muscle groups
- Archive workouts and exercises
- View individual exercise details

### Scheduling and workout sessions

- Schedule workouts
- Track active workout sessions
- Record completed sets, repetitions, weights and duration
- Review completed and unfinished sessions
- Preserve workout and exercise details in session history

### Dashboard and progress

- Weekly training overview
- Workout history
- Exercise progress
- Weight logging
- Personal goals
- Progress statistics and charts

### Integrations and infrastructure

- MySQL-compatible database
- Prisma ORM and database migrations
- Server-side validation with Zod
- Service and repository architecture
- Exercise image storage with Vercel Blob
- Password reset emails with Resend
- Responsive user interface

## Technology stack

Technology Purpose

---

Next.js 16 Full-stack React framework
React 19 User interface
TypeScript Static typing
Tailwind CSS 4 Styling
Prisma ORM 6 Database access and migrations
MySQL / TiDB Cloud Relational database
Zod 4 Data validation
JSON Web Token Authentication
bcryptjs Password hashing
Recharts Charts and statistics
Sonner Notifications
Vercel Blob Image storage
Resend Transactional email
Vercel Application hosting

## Architecture

GymTracker uses a layered architecture to keep responsibilities
separated and make the codebase easier to maintain.

---

Layer Responsibility

---

`app` Routes, pages and layouts using the
Next.js App Router

`actions` Handle application mutations,
validate input and coordinate
service calls

`services` Contain business logic and
coordinate application workflows

`repositories` Handle database queries through
Prisma

`schemas` Define validation rules with Zod

`mapping` Convert database models into
application types and response
objects

`types` Shared TypeScript types and
interfaces

`lib` / `utils` Shared infrastructure,
authentication, Prisma client and
helper functions

`components` Reusable user-interface components
-----------------------------------------------------------------------

## Getting started

Follow these steps to run GymTracker locally.

### Prerequisites

Install the following tools before getting started:

- [Node.js](https://nodejs.org/) (use a version compatible with the
  project)
- npm
- [Git](https://git-scm.com/)
- MySQL or a compatible MySQL database
- A code editor, such as [Visual Studio
  Code](https://code.visualstudio.com/)

You will also need credentials for any external services you intend to
use, such as Resend or Vercel Blob.

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

Create a `.env` file in the project root and add the variables required
by your local setup. See [Environment
variables](#environment-variables).

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Apply database migrations

For local development:

```bash
npm run db:migrate:dev
```

### 6. Start the development server

```bash
npm run dev
```

Open <http://localhost:3000> in your browser.

## Environment variables

GymTracker uses environment variables to configure database access,
authentication and external services.

Create a `.env` file in the project root. The variables below are
documented by the project:

---

Variable Required for Description

---

`DATABASE_URL` Database MySQL connection string

`SHADOW_DATABASE_URL` Prisma development Connection string for
migrations the shadow database

`JWT_SECRET` Authentication Secret used to sign and
verify JWTs

`RESEND_API_KEY` Email functionality Resend API key

`RESEND_FROM_EMAIL` Email functionality Verified sender address
used for outgoing
emails

`BLOB_READ_WRITE_TOKEN` Image uploads Vercel Blob read/write
token
-------------------------------------------------------------------------

Example configuration:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/SHADOW_DATABASE"

JWT_SECRET="replace-with-a-secure-random-secret"

RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="GymTracker <noreply@example.com>"

BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

**Important security notes** - Replace all example values with your own
credentials. - Use a separate shadow database for Prisma development
migrations. - Never commit `.env` files, API keys or production
credentials to Git. - Use strong, unique secrets in production. -
Configure production environment variables in your hosting provider. -
Only configure external-service variables if the corresponding
functionality is enabled in your environment.

## Database and Prisma

GymTracker uses Prisma ORM with a MySQL-compatible relational database.
The project is documented as supporting MySQL and TiDB Cloud.

### Prisma schema

The schema is located at:

```text
prisma/schema.prisma
```

It defines the database models, relationships and enums. The main models
include:

- `User`
- `PasswordResetToken`
- `Goal`
- `WeightLog`
- `Exercise`
- `MuscleGroup`
- `ExerciseMuscle`
- `Workout`
- `WorkoutExercise`
- `WorkoutSchedule`
- `WorkoutSession`
- `WorkoutSessionExercise`
- `WorkoutSessionSet`

### Migrations

Migration files are stored in:

```text
prisma/migrations/
```

Use the appropriate command for your environment:

Task Command

---

Create and apply a development migration `npm run db:migrate:dev`
Apply pending production migrations `npm run db:migrate:deploy`
Check migration status `npm run db:migrate:status`
Regenerate Prisma Client `npm run db:generate`

**Migration guidelines** - Do not edit migration files that have already
been applied to a database. - Create a new migration when changing the
Prisma schema. - Review generated SQL before applying migrations to
production. - Keep the Prisma schema and migration history in sync. -
Back up important data before making production database changes.

## Available scripts

---

Command Description

---

`npm run dev` Starts the development server

`npm run build` Generates Prisma Client and builds
the application

`npm run start` Starts the production server

`npm run lint` Runs ESLint

`npm run db:generate` Generates Prisma Client

`npm run db:migrate:dev` Creates and applies development
migrations

`npm run db:migrate:deploy` Applies pending production
migrations

`npm run db:migrate:status` Checks migration status
-----------------------------------------------------------------------

Run TypeScript checks separately:

```bash
npx tsc --noEmit
```

## Project structure

High-level overview of the repository:

```text
gym-tracker/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── screenshots/
├── src/
│   ├── actions/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── helpers/
│   ├── lib/
│   ├── mapping/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── types/
│   └── utils/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

This is an overview; individual folders may contain additional files and
nested directories.

## Code quality

Before committing changes, run the checks below:

### TypeScript

```bash
npx tsc --noEmit
```

### ESLint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

Resolve relevant errors before merging or deploying changes.

## Deployment

GymTracker is configured for deployment on
[Vercel](https://vercel.com/).

### Production checklist

1.  Connect the GitHub repository to Vercel.

2.  Configure the production environment variables in Vercel.

3.  Configure and verify access to the production MySQL-compatible
    database.

4.  Ensure the Prisma schema changes have corresponding migrations.

5.  Apply pending migrations to the production database:

    ```bash
    npm run db:migrate:deploy
    ```

6.  Deploy the application.

7.  Verify the deployed application, database connection,
    authentication, email delivery and image uploads.

The documented build command is:

```bash
prisma generate && next build
```

This generates Prisma Client before building the Next.js application.
Confirm that the Vercel project uses the intended build command and
environment variables.

## Troubleshooting

### Prisma Client is outdated

Regenerate Prisma Client:

```bash
npm run db:generate
```

### Database connection errors

Check the following:

- `DATABASE_URL` is correct.
- Database credentials, host and port are correct.
- The database is running and accepts connections from your
  environment.
- Network access and database permissions are configured correctly.

### Migration errors

Check the migration status:

```bash
npm run db:migrate:status
```

Review the Prisma error and migration history before making changes.
Avoid resetting or manually modifying a database that contains data you
need to keep.

### JWT configuration errors

Verify that `JWT_SECRET` is set in the relevant environment and that the
same intended secret is available wherever tokens are signed and
verified.

### Vercel Blob upload errors

Verify that `BLOB_READ_WRITE_TOKEN` is configured for the environment
where the upload is running.

### Email delivery errors

Verify that:

- `RESEND_API_KEY` is valid.
- `RESEND_FROM_EMAIL` uses a sender address configured with Resend.
- Your sender domain is correctly verified in Resend.

## Screenshots

Screenshots are stored in the `screenshots/` directory.

### Dashboard

![GymTracker dashboard](screenshots/Dashboard.png)

### Exercises

![GymTracker exercises](screenshots/Exericესes.png)

### Weight log

![GymTracker weight log](screenshots/WeightLog.png)

### Workout

![GymTracker workout](screenshots/Workout-item.png)

> If a screenshot does not appear on GitHub, check that its filename and
> capitalization match the actual file in the `screenshots/` directory.

## License

GymTracker is proprietary software.

Copyright (c) 2026 David Söderberg. All rights reserved.

See [LICENSE](./LICENSE) for the full license terms.

Third-party dependencies and their licenses are documented in
[Third-party notices](./2.%20THIRD-PARTY-NOTICES.md).
