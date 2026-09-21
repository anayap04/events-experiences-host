[![SonarQube Cloud](https://sonarcloud.io/images/project_badges/sonarcloud-dark.svg)](https://sonarcloud.io/summary/new_code?id=anayap04_events-experiences-host)
# Events Experiences Host

[![Hostinger Deployment](https://github.com/anayap04/events-experiences-host/actions/workflows/deploy-hostinger.yml/badge.svg)](https://github.com/anayap04/events-experiences-host/actions/workflows/deploy-hostinger.yml)
[![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=anayap04_events-experiences-host&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=anayap04_events-experiences-host)
[![License](https://img.shields.io/github/license/anayap04/events-experiences-host)](LICENSE)

Next.js App Router container for event and experience microfrontends. The app provides an accessible host shell, GitHub authentication, Ant Design UI, MySQL/phpMyAdmin integration, and static deployment to Hostinger.

## Local development

1. Copy `.env.example` to `.env.local` and fill in the values for your environment.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

The app is available at `http://localhost:3000/events-experiences` because the production base path is configured in `next.config.mjs`.

Useful checks:

```bash
npm run type-check
npm test
npm run build
```

## Environment variables

`.env.example` documents the MySQL connection, public base path, microfrontend remote URLs, and Hostinger deployment constants. Never commit `.env.local` or any file containing passwords, FTP credentials, or tokens.

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

The project is configured for the `anayap04` SonarCloud organization in `sonar-project.properties` with project key `anayap04_events-experiences-host`. The SonarCloud workflow runs on pushes to `main` and pull requests. Add the `SONAR_TOKEN` repository secret before enabling the workflow.

SonarCloud organization: https://sonarcloud.io/organizations/anayap04
