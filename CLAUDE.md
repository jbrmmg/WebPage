# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run build        # production build → dist/JbrMmg
npm test             # run tests (interactive, opens browser)
npm run test-headless  # run tests in CI mode (ChromeHeadless, with coverage)
npm run lint         # lint
```

To run a single test file, use the `--include` flag:
```bash
npx ng test --include='src/app/money/money.service.spec.ts' --watch=false --browsers=ChromeHeadless
```

### Dev server

```bash
npm run startdocker   # proxy to local Docker stack (localhost:80)
npm start             # no proxy — serves without backend
```

`startdocker` uses `proxy.docker.conf.json`, which forwards `/backup` and `/money` to `localhost:80` (the running Docker proxy container).

### Build (Maven)

Maven runs `npm install` + `ng build` + packages a zip via `maven-assembly-plugin`. It also generates `src/api/util/version.json` from the project version before the Angular build — this file is gitignored and must exist before `ng build` runs. When building outside Maven, create it manually:

```bash
echo '{"version":"dev"}' > src/api/util/version.json
npm run build
```

### Docker

The Angular app is served by the `webpage` container (static files only). All routing to backends is handled by a separate `proxy` container defined in `nginx/`. See README for full deployment instructions.

```bash
npm run build
docker build -t webpage .
```

## Architecture

Single Angular 17 module app (`AppModule`) with two significant feature areas and several lightweight ones.

### Routing

All routes are declared inline in `app.module.ts`. Top-level routes map directly to feature components:

| Route | Component |
|---|---|
| `/welcome` | `WelcomeComponent` |
| `/money` | `MoneyComponent` |
| `/bup` | `BackupListComponent` |
| `/weight`, `/house`, `/wifi` | Simple standalone components |

### Environment / API URLs

All API URLs are defined in `src/environments/environment.ts` (dev) and `environment.prod.ts` (prod). In dev mode the URLs point to local JSON fixture files under `src/api/` so the app runs without a backend. In prod mode they point to the real REST endpoints, which nginx proxies to the backend services.

The `##placeholder##` pattern in environment URLs (e.g. `##id##`, `##type##`) is string-replaced in the service layer before use.

### Backend proxy

Two backends, proxied by path prefix:

| Prefix | Backend (prod, by container name) |
|---|---|
| `/backup` | `backup:8080` — rewrites to `/api/v1/` |
| `/money` | `money:8080` — rewrites to `/api/v1/` |

In dev: Angular CLI handles proxying via `proxy.*.conf.json` (same path rewrite). In production/Docker: nginx handles it via `nginx/nginx.conf.template`.

### Money module (`src/app/money/`)

The largest feature. `MoneyComponent` is the top-level container; `MoneyService` handles all HTTP calls. Sub-components are broken into sub-directories: `account`, `add`, `calculator`, `category`, `files`, `filter`, `grid`, `reconciliation`, `range`, `statement`, `toolbar`, `transaction`, `transfer`. The `grid/` sub-tree contains a mix of NgModule-declared and standalone components — newer additions tend to be standalone.

Some components use Server-Sent Events (`EventSource`) for live updates (`money/reconciliation/file-updates`).

### Backup module (`src/app/backup/`)

`BackupListComponent` is a tab-style container that switches between sub-views via a `ListMode` enum (Files, Actions, Summary, Import, Logs, Photo, Prints). Each view is a separate component/sub-directory. The import grid uses `EventSource` for live file-update streaming.

### Component style

Older components are NgModule-declared in `AppModule`. Newer/smaller components (especially grid cells and column headers) are standalone and imported directly in `AppModule`'s `imports` array. When adding new components, follow the pattern of nearby code in the same sub-directory.
