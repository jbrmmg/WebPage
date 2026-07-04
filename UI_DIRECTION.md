# UI Direction

Notes on the future direction of the Angular web UI and related Python services.

## Simple Angular Pages — Migrate to Python?

The following routes exist in the Angular app but are currently placeholder shells with no real content:

| Route | Component | Current State |
|---|---|---|
| `/weight` | `WeightComponent` | Empty card shell |
| `/house` | `HouseComponent` | Empty card shell |
| `/wifi` | `WifiComponent` | Displays a QR code image |

### Recommendation

Leave them in Angular for now — migrating empty pages gains nothing. The decision point is when these pages are actually built out:

- **Stay simple** (static content, a form, a chart from a REST call) → Python/Flask with Jinja2 templates is a good fit and consistent with WordHelper and Home.
- **Grow complex** (real-time updates, complex state, tight integration with the Money or Backup modules) → Keep in Angular.

---

## nginx Routing for Python Services

Currently each Python service exposes a different host port:

| Service | Port |
|---|---|
| WordHelper | 5000 |
| WordClue | 5001 |
| Home | 5002 |

Since all containers share `jbr-network`, a dedicated nginx reverse-proxy container on that network can route by URL path to each service by container name — no ports need to be exposed to the host.

### Target URL mapping

| URL path | → Container |
|---|---|
| `/wordhelper/` | `wordhelper:8080` |
| `/wordclue/` | `wordclue:8080` |
| `/home/` | `home:8080` |

### Approach options

1. **Dedicated nginx proxy container** (recommended) — clean separation, one place to manage all routing, survives independent restarts of any app. Add to `jbr-network` and expose port 80/443.
2. **Extend the WebPage nginx** — fewer containers, but couples the Angular app's lifecycle to all Python app routing.

### Caveat — path prefix awareness

With path-based routing the Python apps need to be aware of their URL prefix, otherwise internal links and static assets break. Before wiring up nginx, check:

- Flask: set `APPLICATION_ROOT` or use a `url_prefix` on blueprints.
- Jinja2 templates: ensure asset URLs use `url_for()` rather than hardcoded paths.
