[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-dark.svg)](https://sonarcloud.io/summary/new_code?id=anayap04_events-experiences-host)
# Events Experiences Host

[![Hostinger Deployment](https://github.com/anayap04/events-experiences-host/actions/workflows/deploy-hostinger.yml/badge.svg)](https://github.com/anayap04/events-experiences-host/actions/workflows/deploy-hostinger.yml)
[![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=anayap04_events-experiences-host&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=anayap04_events-experiences-host)
[![License](https://img.shields.io/github/license/anayap04/events-experiences-host)](LICENSE)

Next.js App Router container for event and experience microfrontends. The app provides an accessible host shell, GitHub authentication, Ant Design UI, MySQL/phpMyAdmin integration, and static deployment to Hostinger.

## What this app does

The host shell authenticates a user via GitHub, then renders a dashboard of "experiences" (events, pop-ups, VIP tours, ticketed gatherings) backed by MySQL. Each experience can be handed off to an isolated **microfrontend (MFE)**, loaded through a lightweight remote registry, so that domain teams (events, experiences, ticketing) can ship independently deployed remotes into a single shell.

Key pieces:

- **Authentication** (`src/features/auth`, `src/lib/github-auth.ts`) — looks up a GitHub user's public profile, then cross-checks that account against an allow-list stored in the MySQL database (`isApproved`). Profile drift (name, avatar, bio, repo count) is synced back to the DB on login.
- **Events dashboard** (`src/features/events`) — search, filter (category/status), and grid/list views over experiences, with create/edit/delete flows backed by `src/lib/api-client.ts`.
- **Microfrontend registry** (`src/lib/mfe-registry.ts`, `src/features/mfe`) — tracks the registered remotes (`events`, `experiences`, `tickets`), their status (`active`/`maintenance`), version, and WCAG conformance level, and mounts the selected remote inside `MfeContainer`.
- **Accessibility** — dedicated `SkipLink`, `LiveAnnouncer`, and `AccessibleNav` components, plus a Jest + jest-axe accessibility test suite (`npm run test:a11y`).
- **Database** (`src/lib/db.ts`) — MySQL connection via `mysql2`, used for user approval lookups and experience persistence, intended to be managed through phpMyAdmin on Hostinger.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, static export via `output: 'export'`)
- React 18 + TypeScript
- [Ant Design 6](https://ant.design/) (`antd`, `@ant-design/nextjs-registry`, `@ant-design/icons`) and `lucide-react` icons
- MySQL via `mysql2`, hosted on Hostinger/phpMyAdmin
- Jest, React Testing Library, and `jest-axe` for unit and accessibility testing
- ESLint 9 / `eslint-config-next`
- GitHub Actions for CI, SonarCloud analysis, and FTP deployment to Hostinger

## Project structure

```
src/
├── app/                # App Router routes (/, /auth, /events, /experiences)
├── components/         # Shared shell UI (nav, skip link, live announcer, MFE container)
├── features/
│   ├── auth/            # AuthProvider + AuthPage
│   ├── events/           # EventsDashboard, EventCard, EventCreatorModal, mock data
│   └── mfe/              # MfeContainer, MfeRegistryView
├── lib/                 # db.ts, github-auth.ts, mfe-registry.ts, api-client.ts
└── types/               # Shared TypeScript types
__tests__/              # Jest + jest-axe accessibility and registry tests
```

## Local development

1. Copy `.env.example` to `.env.local` and fill in the values for your environment.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

The app is available at `http://localhost:3000/events-experiences` because the production base path is configured in `next.config.mjs`.

Useful checks:

```bash
npm run type-check
npm run lint
npm test
npm run test:a11y
npm run build
```

## Environment variables

`.env.example` documents the MySQL connection, public base path, microfrontend remote URLs, and Hostinger deployment constants. Never commit `.env.local` or any file containing passwords, FTP credentials, or tokens.

| Variable | Purpose |
| --- | --- |
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` | Server-side MySQL/phpMyAdmin connection used for auth and experience data |
| `NEXT_PUBLIC_BASE_PATH` | Public base path the static export is served under |
| `NEXT_PUBLIC_SITE_URL` | Canonical deployed site URL |
| `NEXT_PUBLIC_MFE_EVENTS_URL` | Remote entry URL for the Events Discovery microfrontend |
| `NEXT_PUBLIC_MFE_EXPERIENCES_URL` | Remote entry URL for the Interactive Experiences microfrontend |
| `NEXT_PUBLIC_MFE_TICKETS_URL` | Remote entry URL for the Ticketing & Pass microfrontend |
| `HOSTINGER_HOST`, `HOSTINGER_USERNAME`, `HOSTINGER_PASSWORD`, `HOSTINGER_PORT` | Hostinger FTP deployment credentials (GitHub Actions secrets only) |
| `SONAR_TOKEN` | SonarCloud analysis token (GitHub Actions secret) |

The `NEXT_PUBLIC_*` values are embedded into the browser bundle during the build. Hostinger FTP credentials are used only by GitHub Actions and should be stored as repository secrets:

- `HOSTINGER_HOST`
- `HOSTINGER_USERNAME`
- `HOSTINGER_PASSWORD`
- `HOSTINGER_PORT`
- `SONAR_TOKEN`

## Hostinger deployment

Pushing to `main` runs `.github/workflows/deploy-hostinger.yml`. The workflow builds the static `dist/` output and deploys it to:

`./domains/anayap.tech/public_html/events-experiences/`

The deployed site is `https://anayap.tech/events-experiences/`.

## SonarCloud

The project is configured for the `anayap04` SonarCloud organization in `sonar-project.properties` with project key `anayap04_events-experiences-host`. The SonarCloud workflow (`.github/workflows/sonarcloud.yml`) runs on pushes to `main` and pull requests. Add the `SONAR_TOKEN` repository secret before enabling the workflow.

SonarCloud organization: https://sonarcloud.io/organizations/anayap04
