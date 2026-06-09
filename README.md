# WebPage (jbrmmg)

Personal dashboard Angular web application by Jason Brown ([jbrmmg.me.uk](https://jbrmmg.me.uk)).

## Overview

A multi-module Angular 17 frontend that provides a unified interface for several personal management tools. The app communicates with backend REST APIs via proxy configuration.

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
- **UI**: Bootstrap 5, Angular Material, ngx-bootstrap
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

### Proxy configuration

The app proxies two backend APIs:

| Path prefix | Internal ports | Production ports |
|-------------|---------------|-----------------|
| `/backup` | `localhost:13013/jbr/int` | `localhost:12013/jbr/int` |
| `/money` | `localhost:13017/jbr/int` | `localhost:12017/jbr/int` |

Choose the proxy config file that matches your backend environment when starting the dev server.

## Build

```bash
npm run build
```

Outputs a production build.

## Docker

Build the Angular app first, then build and run the Docker image:

```bash
npm run build
docker build -t webpage .
docker run -d \
  --name webpage \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  -p 80:80 \
  -e BACKUP_BACKEND=host.docker.internal:12013 \
  -e MONEY_BACKEND=host.docker.internal:12017 \
  webpage
```

`--add-host=host.docker.internal:host-gateway` makes the host machine reachable from inside the container. Use this when the backend services are running directly on the host.

| Environment variable | Description                                | Default                          |
|----------------------|--------------------------------------------|----------------------------------|
| `BACKUP_BACKEND`     | `hostname:port` of the backup backend      | `host.docker.internal:12013`     |
| `MONEY_BACKEND`      | `hostname:port` of the money backend       | `host.docker.internal:12017`     |

nginx serves the Angular app and proxies `/backup` and `/money` requests to the respective backends. The `proxy.conf.json` files are dev-server only and have no effect in Docker.

## Testing

```bash
# Interactive
npm test

# Headless (CI)
npm run test-headless

# Lint
npm run lint

# End-to-end
npm run e2e
```
