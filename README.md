# Edukat Monorepo (POC)

School assignment proof-of-concept with:

- `backend`: Node.js + Fastify + TypeScript + Prisma (PostgreSQL)
- `mobile`: React Native Expo + TypeScript

## Repository Structure

```
backend/
mobile/
```

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL (local or remote)
- Expo Go app (optional for mobile device testing)

## 1) Backend Setup

```bash
cd backend
npm install
```

Create env file:

```bash
cp .env.example .env
```

Update `backend/.env` as needed:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (default `4000`)

Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate:dev -- --name init_schema
```

Run backend:

```bash
npm run dev
```

Health check:

- `GET http://localhost:4000/health`

## 2) Mobile Setup

```bash
cd mobile
npm install
```

Update API URL in:

- `mobile/src/utils/env.ts`

For emulator/simulator:

- usually `http://localhost:4000`

For physical device:

- use your machine LAN IP, e.g. `http://192.168.1.10:4000`

Run mobile app:

```bash
npm start
```

## Auth (POC)

- OTP is mocked as `123456`
- Roles:
  - `TEACHER`
  - `STUDENT`
- Token and user are persisted in local storage (Zustand + AsyncStorage)

## Key Rules in Current POC

- Layering:
  - routes -> services -> repositories -> Prisma
- Protected routes use auth middleware
- Class membership checks gate class-scoped data
- API response format:
  - success: `{ "success": true, "data": ... }`
  - error: `{ "success": false, "error": { "code": "...", "message": "..." } }`

## Main Feature Flow

- Teacher:
  - create school
  - create class
  - create assignment
  - review submissions
- Student:
  - join class
  - view class feed
  - submit assignment work

## Notes

- File and audio inputs are URL placeholders for now.
- Real upload, recording, realtime chat, and advanced analytics are intentionally out of scope for this POC.
