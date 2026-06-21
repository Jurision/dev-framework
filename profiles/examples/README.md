# Profile selection examples

Illustrative `adoption-manifest` compositions, **desensitized** from the three frozen
dry-runs (no project names, paths, IPs, SHAs, or private evidence). They show the
**base + modifiers** model end-to-end — copy the nearest shape and adjust.

- [`data-ai-workbench.yml`](data-ai-workbench.yml) — a data/AI pipeline with an internal
  analyst workbench.
- [`public-content-web.yml`](public-content-web.yml) — a public content site with an internal
  admin.
- [`multitenant-app-with-documents.yml`](multitenant-app-with-documents.yml) — an
  authenticated multi-tenant app that generates locked documents.

The two web apps compose **differently** (`public-ui` vs `multi-tenant` + `protected-output`)
— which is exactly why composable modifiers beat one coarse `team-web` profile.
