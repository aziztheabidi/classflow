# Mobile App (Expo + TypeScript)

Simple React Native Expo client for the school assignment POC.

## Run

1. `cd mobile`
2. `npm install`
3. `npm start`

## Notes

- API base URL is in `src/utils/env.ts`
- Auth token and user are persisted in Zustand + AsyncStorage
- Screens stay UI-focused and all HTTP calls are under `src/api`
