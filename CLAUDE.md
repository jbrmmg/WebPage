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

| Command | Proxy config | Backend ports |
|---|---|---|
| `npm run startdbg` | `proxy.conf.json` | 13013 / 13017 |
| `npm run startpdn` | `proxy.prod.conf.json` | 12013 / 12017 |
| `npm run startdev` | `proxy.dev.conf.json` | dev ports |

### Build (Maven)

Maven runs `npm install` + `ng build` + packages a zip via `maven-assembly-plugin`. It also generates `src/api/util/version.json` from the project version before the Angular build — this file is gitignored and must exist before `ng build` runs. When building outside Maven, create it manually:

```bash
echo '{"version":"dev"}' > src/api/util/version.json
npm run build
```

### Docker

```bash
npm run build
docker build -t webpage .
docker run -d \
  --name webpage \
  --restart unless-stopped \
  -p 80:80 \
  -e BACKUP_BACKEND=myserver:12013 \
  -e MONEY_BACKEND=myserver:12017 \
  webpage
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

| Prefix | Backend (prod) |
|---|---|
| `/backup` | `host:12013/jbr/int` |
| `/money` | `host:12017/jbr/int` |

In dev: Angular CLI handles proxying via `proxy.*.conf.json`. In production/Docker: nginx handles it via `nginx.conf.template`.

### Money module (`src/app/money/`)

The largest feature. `MoneyComponent` is the top-level container; `MoneyService` handles all HTTP calls. Sub-components are broken into sub-directories: `account`, `calculator`, `category`, `files`, `grid`, `reconciliation`, `range`, `statement`, `transaction`. The `grid/` sub-tree contains a mix of NgModule-declared and standalone components — newer additions tend to be standalone.

Some components use Server-Sent Events (`EventSource`) for live updates (`money/reconciliation/file-updates`).

### Backup module (`src/app/backup/`)

`BackupListComponent` is a tab-style container that switches between sub-views via a `ListMode` enum (Files, Actions, Summary, Import, Logs, Photo, Prints). Each view is a separate component/sub-directory. The import grid uses `EventSource` for live file-update streaming.

### Component style

Older components are NgModule-declared in `AppModule`. Newer/smaller components (especially grid cells and column headers) are standalone and imported directly in `AppModule`'s `imports` array. When adding new components, follow the pattern of nearby code in the same sub-directory.
