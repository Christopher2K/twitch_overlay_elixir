# AGENTS.md

## Setup and commands

- Toolchain: Elixir 1.18.4 / Erlang OTP 28 (`.tool-versions`), Node 22 (Docker build), and pnpm 10.15.0 (`assets/package.json`; newer pnpm versions can fail the package-manager check).
- Create `.env` from `.env.example` and fill the Twitch values. Run `mix setup`, then `mix phx.server` for the dev server on port 4000; its watchers build client JS, SSR JS, and Tailwind CSS.
- `mix test` creates and migrates the SQLite test database automatically. Focus with `mix test path/to/test.exs` or `mix test path/to/test.exs:LINE`.
- `.env` is loaded automatically only in dev. For tests, export it first: `set -a; source .env; set +a; mix test`.
- Application boot requires all five `TWITCH_*` variables and `TwitchAppTokenWorker` immediately requests a real Twitch app token—even in tests. Tests therefore need valid Twitch client credentials and network access.
- Frontend checks: `pnpm --dir assets check` (TypeScript) and `pnpm --dir assets lint` (Prettier). Format with `mix format` and `pnpm --dir assets format` as applicable.
- Build both client and SSR bundles with `mix assets.build`; use `mix assets.deploy` for minified/digested production assets. Do not edit generated `priv/ssr.js` or `priv/static/assets/`.

## Architecture

- Everything frontend is React 19 on Inertia 3 (`@inertiajs/react`); there is no Svelte left. Overlay pages live in `assets/js/pages/overlay/**/*.tsx` with components in `assets/js/lib/components/overlay/`; admin pages in `assets/js/pages/admin/*.tsx` share the `_layout` nav, which is attached through the app-level `layout` option in both entrypoints. Shared UI primitives (button, field, form, textinput, alert) sit in `assets/js/lib/components/`. `assets/js/app.tsx` (client) and `assets/js/ssr.tsx` (server) must stay in sync: same dynamic `./pages/${name}.tsx` resolver, same `layoutFor` rule, same `http` CSRF option. Guard browser-only APIs during SSR; both entrypoints render through `renderToString`.
- Inertia 3 embeds the page in `<script data-page="app" type="application/json">` and renders into `<div id="app" data-server-rendered>`; the v3 adapter reads that script and self-mounts/hydrates (no custom `setup` for CSR). Flash is a top-level `usePage().flash` key, not a prop; dismissal is tracked by flash object identity so a new page re-shows the alert. CSRF uses the axios client from `@inertiajs/core` via `http: { xsrfHeaderName: "x-csrf-token" }`.
- Domain code uses schemas, `*Repo` modules, and single-purpose `Services.*` modules called directly by controllers; there are no `Accounts`, `Configuration`, or `Integration` context facade modules despite legacy tests referencing them.
- Twitch EventSub POSTs flow through `WebhookController` and `Webhooks.Services.HandleWebhookEvent`, then broadcast `"alert"` on `alerts_room:lobby`. `use-alerts.ts` consumes that topic through `/socket/events`.
- Webhook signature verification uses the raw request body saved by `Endpoint.copy_req_body/2`; preserve its position before `Plug.Parsers` when changing request parsing.

## Current test baseline

- The full suite is not green: legacy context tests call removed facade APIs, and generated page/channel tests no longer match the implementation (verified: 32 tests, 27 failures). Run focused tests for changed behavior and distinguish new failures from this baseline rather than treating all existing failures as related.

## Release notes

- The app runs migrations automatically outside releases; releases skip that startup migration. The Docker CMD explicitly runs `bin/migrate`, auto-creates the admin from `ADMIN_USERNAME`/`ADMIN_PASSWORD`, then starts the server.
- `mix admin.create` currently points to the missing `lib/scripts/admin_create.exs`; do not rely on it for local admin creation without fixing the alias/script.
