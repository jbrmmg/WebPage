# WebPage (jbrmmg)

Personal dashboard Angular web application by Jason Brown ([jbrmmg.me.uk](https://jbrmmg.me.uk)).

## Overview

A multi-module Angular 17 frontend that provides a unified interface for several personal management tools. In production the app runs as a Docker container behind a dedicated nginx reverse proxy that also routes traffic to the Python companion apps and the Java backend APIs.

## Modules

| Route | Module | Description |
|-------|--------|-------------|
| `/welcome` | Home | Landing page with version info |
| `/money` | Money | Financial tracking — accounts, transactions, categories, reconciliation, statements |
| `/bup` | Backup | File backup management — file hierarchy, action list, summary, logs, photo/print viewer, map |
| `/house` | House | House information |
| `/weight` | Weight | Weight tracking |
| `/wifi` | WiFi | WiFi information |

## Tech Stack

- **Framework**: Angular 17
- **UI**: Bootstrap 5, Angular Material, ngx-bootstrap (dark theme via CSS variables in `src/styles.css`)
- **Maps**: Leaflet
- **Testing**: Karma + Jasmine

## Prerequisites

- Node.js
- Angular CLI (`npm install -g @angular/cli`)

## Setup

```bash
npm install
```

## Development

### Start scripts

| Command | Description |
|---------|-------------|
| `npm start` | Serve with default config (no backend proxy) |
| `npm run startdocker` | Serve with debug-web config + `proxy.docker.conf.json` (proxies to local Docker stack) |

### Proxy configuration (dev server only)

`startdocker` uses `proxy.docker.conf.json`, which forwards `/backup` and `/money` to `localhost:80` — the locally-running Docker proxy container. This is the standard development workflow.

## Build

```bash
npm run build
```

Outputs a production build to `dist/JbrMmg`.

### Building outside Maven

Maven generates `src/api/util/version.json` before the Angular build. When building manually:

```bash
echo '{"version":"dev"}' > src/api/util/version.json
npm run build
```

## Production Architecture

In production, all traffic goes through a dedicated **nginx reverse proxy container** (defined in `nginx/`). The Angular app container sits on the internal Docker network only — it is not exposed directly to the host. Backends are resolved by Docker container name on `jbr-network` — no environment variable substitution is used in the template.

| Public path | Upstream container | Port | Notes |
|---|---|---|---|
| `/wordhelper/` | `wordhelper` | 8080 | Word Helper Python app |
| `/wordclue/` | `wordclue` | 8080 | Word Clue Python app |
| `/home/` | `home` | 8080 | Home dashboard Python app |
| `/money/report/` | `money` | 8081 | Money report app |
| `/money/docs/` | `money` | 8080 | Money API Swagger UI |
| `/backup/docs/` | `backup` | 8080 | Backup API Swagger UI |
| `/home/docs/` | `home` | 8080 | Home API Swagger UI |
| `/money/api/v1/` | `money` | 8080 | Money Java REST API (direct, no rewrite) |
| `/money/` | `money` | 8080 | Money Java REST API (rewrites to `/api/v1/`) |
| `/backup/api/v1/` | `backup` | 8080 | Backup Java REST API (direct, no rewrite) |
| `/backup/` | `backup` | 8080 | Backup Java REST API (rewrites to `/api/v1/`) |
| `/` | `webpage` | 80 | Angular SPA (catch-all, must be last) |

All containers must be on the `jbr-network` Docker network so the proxy can reach them by container name.

## Docker

### Angular app container (`webpage`)

The Angular app container serves static files only. It does **not** need backend environment variables — all proxying is handled by the nginx proxy container.

```bash
npm run build
docker build -t webpage .
```

`docker-compose.yml` — runs the `webpage` container on `jbr-network` with no host port binding.

### nginx proxy container (`proxy`)

Defined in `nginx/`. This container handles all inbound traffic and routes it to the appropriate upstream.

```bash
docker build -f nginx/Dockerfile -t proxy nginx/
```

`nginx/docker-compose.yml` — runs the `proxy` container on port 80 of the host.

```bash
docker compose -f nginx/docker-compose.yml up -d
```

### nginx configuration

`nginx/nginx.conf.template` is processed by `envsubst` at container startup (standard `nginx:alpine` behaviour). All upstream backends are resolved by Docker container name (`backup`, `money`, `webpage`, `wordhelper`, `wordclue`, `home`) — no environment variable substitution is required.

The `X-Forwarded-Prefix` header is set for each Python app location so that Flask's `ProxyFix` middleware can generate correct prefixed URLs.

## Testing

```bash
# Interactive
npm test

# Headless (CI)
npm run test-headless

# Single spec file
npx ng test --include='src/app/money/money.service.spec.ts' --watch=false --browsers=ChromeHeadless

# Lint
npm run lint
```

## Self-hosted runners

GitHub Actions uses self-hosted runners. The runner image and compose file live in `src/deployment/github/`. It is based on `myoung34/github-runner` with Google Chrome pre-installed (needed for headless Karma tests).

```bash
cd src/deployment/github
docker compose up -d
```

Required environment (`.env` / `.env.secrets`): `RUNNER_NAME`, `LABELS`, and a GitHub registration token.

## CI/CD

Two GitHub Actions workflows handle build, test, and deployment:

### Production (`build.yml`)

Triggers on push to `Release`. Runs on the `webpage-prod` self-hosted runner.

1. Builds and tests with Maven (which also runs `npm install` + `ng build`)
2. Runs Sonar analysis
3. Builds two Docker images: `webpage` and `proxy`
4. Pushes both to the Nexus registry (`nexus.jbrmmg.me.uk:8083`)
5. Deploys: pulls and restarts the proxy container first, then the webpage container

### Development (`dev.yml`)

Triggers on push to any branch **except** `Release`. Runs on the `webpage-dev` / `angular-dev` self-hosted runners.

1. Builds, tests, and pushes images (same steps as production)
2. Deploys the `webpage` container on the dev runner
3. Deploys the `proxy` container across all dev nginx instances (matrix deploy)

### Required repository secrets

| Secret | Used by |
|---|---|
| `NEXUS_PASSWORD` | Both workflows |
| `SONAR_TOKEN` | Both workflows |
| `PDN_WEBPAGE_MONEY_BACKEND` | Both workflows (proxy deploy) |
| `PDN_WEBPAGE_BACKUP_BACKEND` | Both workflows (proxy deploy) |
| `PDN_WEBPAGE_HOME_API_BACKEND` | Both workflows (proxy deploy) |
