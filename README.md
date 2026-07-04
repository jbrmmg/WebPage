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
| `npm start` | Serve with internal/default config |
| `npm run startint` | Serve with `debug` configuration |
| `npm run startdbg` | Serve with debug-web config + `proxy.conf.json` (ports 13013/13017) |
| `npm run startpdn` | Serve with debug-web config + `proxy.prod.conf.json` (ports 12013/12017) |
| `npm run startdev` | Serve with debug-web config + `proxy.dev.conf.json` |
| `npm run startdevdbg` | Serve with debug-web config + `proxy.dev-dbg.conf.json` (ports 13013/13017) |

### Proxy configuration (dev server only)

The Angular dev server proxies two backend APIs:

| Path prefix | Debug ports | Production ports |
|-------------|-------------|-----------------|
| `/backup` | `localhost:13013/jbr/int` | `localhost:12013/jbr/int` |
| `/money` | `localhost:13017/jbr/int` | `localhost:12017/jbr/int` |

These proxy configs are dev-server only and have no effect in Docker.

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

In production, all traffic goes through a dedicated **nginx reverse proxy container** (defined in `nginx/`). The Angular app container sits on the internal Docker network only — it is not exposed directly to the host.

| Public path | Upstream container | Port | Notes |
|---|---|---|---|
| `/wordhelper/` | `wordhelper` | 8080 | Word Helper Python app |
| `/wordclue/` | `wordclue` | 8080 | Word Clue Python app |
| `/home/` | `home` | 8080 | Home dashboard Python app |
| `/money/` | `${MONEY_BACKEND}` | 12017 | Money Java REST API (`/api/v1/` prefix stripped) |
| `/backup/` | `${BACKUP_BACKEND}` | 12013 | Backup Java REST API (`/api/v1/` prefix stripped) |
| `/` | `webpage` | 80 | Angular SPA (catch-all, must be last) |

All containers must be on the `jbr-network` Docker network so the proxy can reach them by container name.

All containers communicate over the external Docker network `jbr-network`.

## Docker

### Angular app container (`webpage`)

The Angular app container serves static files only. It does **not** need backend environment variables — all proxying is handled by the nginx proxy container.

```bash
npm run build
docker build -f src/deployment/Dockerfile -t webpage .
```

`docker-compose.yml` — runs the `webpage` container on `jbr-network` with no host port binding.

### nginx proxy container (`proxy`)

Defined in `nginx/`. This container handles all inbound traffic and routes it to the appropriate upstream.

```bash
docker build -f nginx/Dockerfile -t proxy nginx/
```

`nginx/docker-compose.yml` — runs the `proxy` container on port 80 of the host. Requires two environment variables:

| Variable | Description |
|---|---|
| `MONEY_BACKEND` | `hostname:port` of the money backend (e.g. `myserver:12017`) |
| `BACKUP_BACKEND` | `hostname:port` of the backup backend (e.g. `myserver:12013`) |

Pass these via a `.env` file alongside `docker-compose.yml`, or inline:

```bash
MONEY_BACKEND=myserver:12017 BACKUP_BACKEND=myserver:12013 \
  docker compose -f nginx/docker-compose.yml up -d
```

### nginx configuration

`nginx/nginx.conf.template` is processed by `envsubst` at container startup (standard `nginx:alpine` behaviour). The template substitutes `${MONEY_BACKEND}` and `${BACKUP_BACKEND}`.

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

## CI/CD

GitHub Actions (`.github/workflows/build.yml`) runs on the `webpage-prod` self-hosted runner on every push to `Release`:

1. Builds and tests with Maven (which also runs `npm install` + `ng build`)
2. Runs Sonar analysis
3. Builds two Docker images: `webpage` and `proxy`
4. Pushes both to the Nexus registry (`nexus.jbrmmg.me.uk:8083`)
5. Deploys: pulls and restarts the proxy container first, then the webpage container

Required repository secrets: `NEXUS_PASSWORD`, `SONAR_TOKEN`, `PDN_WEBPAGE_MONEY_BACKEND`, `PDN_WEBPAGE_BACKUP_BACKEND`.
