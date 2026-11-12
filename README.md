# 🏋️ GymTracker

<p align="center">
  <strong>Track your workouts. Measure your progress. Build strength.</strong>
</p>

<p align="center">
  A full-stack workout tracking application built with Next.js, React, TypeScript, Prisma and MySQL.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database and Prisma](#️-database-and-prisma)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Validation and Code Quality](#-validation-and-code-quality)
- [Deployment](#️-deployment)
- [Troubleshooting](#-troubleshooting)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

### Authentication and Account Management

- User registration and login
- JWT-based authentication
- Protected application routes
- Password change
- Forgot password and password reset
- Token versioning for session invalidation

### Workout Management

- Create, edit and manage workouts
- Add exercises to workouts
- Configure sets, repetitions, weights and duration
- Organize exercises within workouts
- Archive workouts and exercises
- View detailed exercise information

### Exercise Management

- Create and manage personal exercises
- Exercise descriptions and instructions
- Exercise images
- Equipment information
- Primary and secondary muscle groups
- Individual exercise pages

### Workout Scheduling and Sessions

- Schedule workouts
- Track active workout sessions
- Record completed sets
- Track actual repetitions, weights and duration
- Review completed and unfinished sessions
- Preserve exercise and workout information in historical sessions

### Dashboard and Progress

- Dashboard with weekly training information
- Workout history
- Exercise progress
- Weight logging
- Personal goals
- Progress statistics and charts

### Infrastructure

- MySQL-compatible database
- Prisma ORM and database migrations
- Server-side validation with Zod
- Service and repository architecture
- Exercise image storage using Vercel Blob
- Password reset emails using Resend
- Responsive user interface

---

## 🛠️ Technology Stack

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| Next.js 16         | Full-stack React framework     |
| React 19           | User interface                 |
| TypeScript         | Static typing                  |
| Tailwind CSS 4     | Styling                        |
| Prisma ORM 6       | Database access and migrations |
| MySQL / TiDB Cloud | Relational database            |
| Zod 4              | Data validation                |
| JSON Web Token     | Authentication                 |
| bcryptjs           | Password hashing               |
| Recharts           | Charts and statistics          |
| Sonner             | Notifications                  |
| Vercel Blob        | Image storage                  |
| Resend             | Transactional emails           |
| Vercel             | Application hosting            |

---

## 🏗️ Architecture

GymTracker follows a layered architecture to separate application responsibilities and make the codebase easier to maintain.

### App Router

- Handles application routes and pages.
- Uses Next.js Server Components and Client Components.
- Organizes protected and public application routes.

### Actions

- Handle application mutations.
- Validate incoming data.
- Coordinate service calls.
- Return standardized action results.

### Services

- Contain business logic.
- Coordinate repositories and other services.
- Handle application workflows.

### Repositories

- Handle database queries through Prisma.
- Keep database access separate from business logic.

### Schemas

- Define validation rules using Zod.
- Validate incoming data on the server.

### Mapping

- Converts database models into application types and response objects.

### Types

- Contains shared TypeScript types and interfaces.

### Lib and Utils

- Contains shared infrastructure and utilities.
- Includes authentication, JWT configuration, Prisma client and helper functions.

---

## 📋 Prerequisites

Before setting up the project, install:

- Node.js
- npm
- Git
- MySQL or a compatible MySQL database
- Access to the GitHub repository

A code editor such as Visual Studio Code is recommended.

---

## 🚀 Getting Started

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

See [Environment Variables](#-environment-variables) for the required configuration.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run database migrations

For local development:

```bash
npm run db:migrate:dev
```

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

The application uses environment variables for database access, authentication and external services.

Create a `.env` file in the project root.

| Variable                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `DATABASE_URL`          | MySQL database connection string                         |
| `SHADOW_DATABASE_URL`   | Shadow database connection string used by Prisma Migrate |
| `JWT_SECRET`            | Secret used to sign and verify JWT tokens                |
| `RESEND_API_KEY`        | API key for Resend email delivery                        |
| `RESEND_FROM_EMAIL`     | Sender email address used for outgoing emails            |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage access token                         |

Example:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/SHADOW_DATABASE"

JWT_SECRET="replace-with-a-secure-secret-of-at-least-32-characters"

RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="GymTracker <noreply@example.com>"

BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

**Important:**

- Replace the example values with your own credentials.
- Use a separate shadow database for Prisma development migrations.
- Never commit `.env` files or production credentials to Git.
- Use secure secrets in production.
- Configure production environment variables in your hosting provider.

---

## 🗄️ Database and Prisma

GymTracker uses Prisma ORM with a MySQL-compatible relational database.

The project supports MySQL and TiDB Cloud.

### Prisma Schema

The Prisma schema is located at:

```text
prisma/schema.prisma
```

It defines the application's database models, relationships and enums.

The main models include:

- User
- PasswordResetToken
- Goal
- WeightLog
- Exercise
- MuscleGroup
- ExerciseMuscle
- Workout
- WorkoutExercise
- WorkoutSchedule
- WorkoutSession
- WorkoutSessionExercise
- WorkoutSessionSet

### Database Migrations

Migrations are stored in:

```text
prisma/migrations/
```

Each migration represents a database schema change.

Use the following commands depending on your environment.

For local development:

```bash
npm run db:migrate:dev
```

For production deployment:

```bash
npm run db:migrate:deploy
```

To check migration status:

```bash
npm run db:migrate:status
```

To regenerate Prisma Client:

```bash
npm run db:generate
```

**Important:**

- Do not manually edit migrations that have already been applied.
- Create a new migration when changing the database schema.
- Review generated SQL before applying migrations to production.
- Keep the Prisma schema and migration history synchronized.

---

## 📜 Available Scripts

| Command                     | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `npm run dev`               | Starts the development server                      |
| `npm run build`             | Generates Prisma Client and builds the application |
| `npm run start`             | Starts the production server                       |
| `npm run lint`              | Runs ESLint                                        |
| `npm run db:generate`       | Generates Prisma Client                            |
| `npm run db:migrate:dev`    | Creates and applies development migrations         |
| `npm run db:migrate:deploy` | Applies pending production migrations              |
| `npm run db:migrate:status` | Checks migration status                            |

TypeScript can be checked separately:

```bash
npx tsc --noEmit
```

---

## 📁 Project Structure

The following is a high-level overview of the project structure.

```text
gym-tracker/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── screenshots/
│
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
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## ✅ Validation and Code Quality

The project uses TypeScript and ESLint to help maintain code quality.

Before committing changes, run:

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

Resolve any reported errors before committing changes.

---

## 🚀 Deployment

GymTracker is designed to be deployed using Vercel.

### Production deployment checklist

1. Connect the GitHub repository to Vercel.
2. Configure the required production environment variables.
3. Configure the production MySQL-compatible database.
4. Ensure the production database schema is up to date.
5. Apply pending migrations using:

```bash
npm run db:migrate:deploy
```

6. Deploy the application.

The build command is configured as:

```bash
prisma generate && next build
```

This ensures that Prisma Client is generated before the Next.js production build.

---

## 🔧 Troubleshooting

### Prisma Client is outdated

Run:

```bash
npm run db:generate
```

### Database connection errors

Check:

- `DATABASE_URL`
- Database credentials
- Database host and port
- Network access to the database
- Database availability

### Migration errors

Check migration status:

```bash
npm run db:migrate:status
```

Review the Prisma error message and migration history before attempting to resolve the problem.

### JWT configuration errors

Ensure that `JWT_SECRET` is configured and contains a sufficiently long secure value.

### Vercel Blob upload errors

Verify that `BLOB_READ_WRITE_TOKEN` is configured correctly in the relevant environment.

### Email delivery errors

Verify:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- Sender domain configuration in Resend

---

## 📸 Screenshots

### Dashboard

![Dashboard](screenshots/Dashboard.png)

### Exercises

![Exercises](screenshots/Exericses.png)

### Weight Log

![Weight Log](screenshots/WeightLog.png)

### Workout

![Workout](screenshots/Workout-item.png)

---

## 📄 License

GymTracker is proprietary software.

Copyright (c) 2026 David Söderberg. All rights reserved.

See [LICENSE](./LICENSE) for the full license terms.

Third-party dependencies and their respective licenses are documented in [Third-party notices](./2.%20THIRD-PARTY-NOTICES.md).
