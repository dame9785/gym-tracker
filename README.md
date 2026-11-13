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
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database and Prisma](#database-and-prisma)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Code Quality](#code-quality)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

GymTracker is a full-stack workout tracking application designed to help users plan their training, record workout sessions and monitor their personal progress over time.

The application provides tools for managing workouts, exercises, training schedules, workout history, body weight and personal goals.

Built with Next.js, React and TypeScript, GymTracker uses Prisma ORM for database access and a layered architecture to separate application responsibilities.

## ✨ Features

### Authentication and Account Management

- User registration and login
- JWT-based authentication
- Protected application routes
- Password changes
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
- Preserve workout and exercise information in historical sessions

### Dashboard and Progress

- Dashboard with weekly training information
- Workout history
- Exercise progress
- Weight logging
- Personal goals
- Progress statistics and charts

### Infrastructure and Integrations

- MySQL-compatible database
- Prisma ORM and database migrations
- Server-side validation with Zod
- Service and repository architecture
- Exercise image storage using Vercel Blob
- Password reset emails using Resend
- Vercel Analytics integration
- Responsive user interface

---

## 🛠️ Technology Stack

### Core Technologies

| Technology         | Version | Purpose                        |
| ------------------ | ------- | ------------------------------ |
| Next.js            | 16.2.10 | Full-stack React framework     |
| React              | 19.2.4  | User interface                 |
| TypeScript         | 5.x     | Static typing                  |
| Tailwind CSS       | 4.x     | Styling                        |
| Prisma ORM         | 6.19.3  | Database access and migrations |
| MySQL / TiDB Cloud | -       | Relational database            |
| Zod                | 4.x     | Data validation                |

### Libraries and Integrations

| Technology       | Purpose                          |
| ---------------- | -------------------------------- |
| JSON Web Token   | Authentication                   |
| bcryptjs         | Password hashing                 |
| date-fns         | Date manipulation and formatting |
| Recharts         | Charts and statistics            |
| Lucide React     | Icons                            |
| React Icons      | Icon library                     |
| Sonner           | Notifications                    |
| Vercel Blob      | Image storage                    |
| Vercel Analytics | Application analytics            |
| Resend           | Transactional emails             |

### Development Tools

| Technology               | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| ESLint                   | Code quality and linting                      |
| Prettier                 | Code formatting                               |
| Prettier Tailwind Plugin | Tailwind CSS class sorting                    |
| Knip                     | Detect unused files, dependencies and exports |

---

## 🏗️ Architecture

GymTracker follows a layered architecture to separate application responsibilities and make the codebase easier to maintain.

| Layer          | Responsibility                                                            |
| -------------- | ------------------------------------------------------------------------- |
| `app`          | Application routes, pages and layouts using the Next.js App Router        |
| `actions`      | Handle application mutations, validate input and coordinate service calls |
| `services`     | Contain business logic and coordinate application workflows               |
| `repositories` | Handle database queries through Prisma                                    |
| `schemas`      | Define validation rules using Zod                                         |
| `mapping`      | Convert database models into application types and response objects       |
| `types`        | Shared TypeScript types and interfaces                                    |
| `lib`          | Shared infrastructure, authentication and Prisma client                   |
| `utils`        | Reusable utility functions                                                |
| `components`   | Reusable user interface components                                        |

### Architecture Principles

- Separation of concerns
- Reusable components
- Centralized validation
- Separation of business logic and database access
- Strong typing with TypeScript
- Server-side data handling
- Maintainable and scalable code structure

---

## 🚀 Getting Started

Follow these instructions to set up GymTracker locally.

### Prerequisites

Before getting started, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)
- MySQL or a compatible MySQL database
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

You will also need credentials for external services you intend to use, such as Resend and Vercel Blob.

### 1. Clone the Repository

```bash
git clone https://github.com/dame9785/gym-tracker.git
cd gym-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

See the [Environment Variables](#environment-variables) section for configuration details.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Database Migrations

For local development:

```bash
npm run db:migrate:dev
```

### 6. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to:

[http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

GymTracker uses environment variables for database access, authentication and external services.

Create a `.env` file in the project root.

### Environment Variable Reference

| Variable                | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `DATABASE_URL`          | MySQL database connection string                         |
| `SHADOW_DATABASE_URL`   | Shadow database connection string used by Prisma Migrate |
| `JWT_SECRET`            | Secret used to sign and verify JWT tokens                |
| `RESEND_API_KEY`        | API key for Resend email delivery                        |
| `RESEND_FROM_EMAIL`     | Sender email address used for outgoing emails            |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage access token                         |

### Example Configuration

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"
SHADOW_DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/SHADOW_DATABASE"

JWT_SECRET="replace-with-a-secure-random-secret"

RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="GymTracker <noreply@example.com>"

BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

### Important Security Notes

- Replace all example values with your own credentials.
- Use a separate shadow database for Prisma development migrations.
- Never commit `.env` files or production credentials to Git.
- Use strong and unique secrets in production.
- Configure production environment variables in your hosting provider.
- Only configure external service variables if the corresponding functionality is enabled.

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

### Database Migrations

Migration files are stored in:

```text
prisma/migrations/
```

| Task                                    | Command                     |
| --------------------------------------- | --------------------------- |
| Create and apply development migrations | `npm run db:migrate:dev`    |
| Apply production migrations             | `npm run db:migrate:deploy` |
| Check migration status                  | `npm run db:migrate:status` |
| Regenerate Prisma Client                | `npm run db:generate`       |

### Migration Guidelines

- Do not manually edit migrations that have already been applied.
- Create a new migration when changing the database schema.
- Review generated SQL before applying migrations to production.
- Keep the Prisma schema and migration history synchronized.
- Back up important data before making production database changes.

---

## 📜 Available Scripts

The following npm scripts are available in the project.

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
| `npm run typecheck`         | Runs Typescript errors                             |
| `npm run db:seed`           | Seeds the database with predefined food products   |

### Additional Development Commands

These commands use installed development tools directly.

**TypeScript validation**

```bash
npx tsc --noEmit
```

**Prettier formatting**

```bash
npx prettier --write .
```

**Check formatting**

```bash
npx prettier --check .
```

**Find unused code and dependencies**

```bash
npx knip
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

This is a high-level overview. Individual folders may contain additional files and nested directories.

---

## ✅ Code Quality

The project uses TypeScript, ESLint and Prettier to help maintain code quality and consistency.

Before committing changes, run the following checks.

### TypeScript

```bash
npx tsc --noEmit
```

### ESLint

```bash
npm run lint
```

### Prettier

```bash
npx prettier --check .
```

### Knip

```bash
npx knip
```

### Production Build

```bash
npm run build
```

Resolve relevant errors before committing or deploying changes.

---

## 🚀 Deployment

GymTracker is designed to be deployed using [Vercel](https://vercel.com/).

### Production Deployment Checklist

1. Connect the GitHub repository to Vercel.
2. Configure the required production environment variables.
3. Configure the production MySQL-compatible database.
4. Ensure the production database schema is up to date.
5. Apply pending migrations:

   ```bash
   npm run db:migrate:deploy
   ```

6. Deploy the application.
7. Verify the deployed application, database connection, authentication, email delivery and image uploads.

### Build Command

The configured build command is:

```bash
prisma generate && next build
```

This ensures that Prisma Client is generated before the Next.js production build.

---

## 🔧 Troubleshooting

### Prisma Client Is Outdated

Regenerate Prisma Client:

```bash
npm run db:generate
```

### Database Connection Errors

Check the following:

- `DATABASE_URL`
- Database credentials
- Database host and port
- Network access to the database
- Database availability

### Migration Errors

Check migration status:

```bash
npm run db:migrate:status
```

Review the Prisma error message and migration history before attempting to resolve the problem.

Avoid resetting databases that contain data you need to keep.

### JWT Configuration Errors

Ensure that `JWT_SECRET` is configured correctly and contains a sufficiently long, secure value.

### Vercel Blob Upload Errors

Verify that `BLOB_READ_WRITE_TOKEN` is configured correctly in the relevant environment.

### Email Delivery Errors

Verify:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- Sender domain configuration in Resend

---

## 📸 Screenshots

Screenshots are stored in the `screenshots/` directory.

### Dashboard

![Dashboard](screenshots/Dashboard.png)

### Exercises

![Exercises](screenshots/Exericесes.png)

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
