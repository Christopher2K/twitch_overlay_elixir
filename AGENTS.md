# AGENTS.md

## Setup and commands

- This is a monorepo: the Phoenix/React application is in `apps/web/`, the standalone Electron wrapper is in `apps/desktop/`, and design documents remain in `design/`. Run application commands from the corresponding app directory unless using an explicit path option.
- Run `devenv shell` from the repository root for the shared toolchain, or enable the included `.envrc` with `direnv allow`. `devenv.nix` provides Elixir 1.18 / Erlang OTP 28, Node 22, pnpm 10, and SQLite.
- The backend also retains `.tool-versions` with Elixir 1.18.4 / Erlang OTP 28. The frontend package manager is pinned in `apps/web/assets/package.json`; newer pnpm versions can fail the package-manager check.
- Create `apps/web/.env` from `apps/web/.env.example` and fill the Twitch values. `SONIOX_API_KEY` is optional unless using translated captions; the key needs Soniox's temporary-key and speech-to-text permissions. From `apps/web/`, run `mix local.hex --force` and `mix local.rebar --force` once for devenv's repository-local Mix home, then run `mix setup`, then `mix phx.server` for the dev server on port 4000; its watchers build client JS, SSR JS, and Tailwind CSS.
- From `apps/web/`, `mix test` creates and migrates the SQLite test database automatically. Focus with `mix test path/to/test.exs` or `mix test path/to/test.exs:LINE`.
- The backend `.env` is loaded automatically only in dev. For tests, export it first from `apps/web/`: `set -a; source .env; set +a; mix test`.
- Application boot requires all five `TWITCH_*` variables and `TwitchAppTokenWorker` immediately requests a real Twitch app token—even in tests. Tests therefore need valid Twitch client credentials and network access.
- Frontend checks from the repository root: `pnpm --dir apps/web/assets check` (TypeScript) and `pnpm --dir apps/web/assets lint` (Prettier). Format from `apps/web/` with `mix format`, and use `pnpm --dir apps/web/assets format` from the root as applicable.
- `apps/desktop/` is a standalone Electron wrapper around `/admin/captions` (no server changes) with its own pnpm project and `.tool-versions` (Node 22, pnpm 10.15.0). From `apps/desktop/`: `pnpm start` runs it, `pnpm dist` builds `dist/mac-arm64/Stream Captions.app` plus a DMG, `pnpm icon` regenerates the icon. It stores the server URL in Electron's userData `config.json`, grants microphone access only to that origin, disables background throttling so captions keep publishing while minimized, and needs `NSMicrophoneUsageDescription`/`audio-input` entitlement kept in `electron-builder.yml` and `build/entitlements.mac.plist`.
- From `apps/web/`, build both client and SSR bundles with `mix assets.build`; use `mix assets.deploy` for minified/digested production assets. Do not edit generated `apps/web/priv/ssr.js` or `apps/web/priv/static/assets/`.

## Architecture

- Everything frontend is React 19 on Inertia 3 (`@inertiajs/react`); there is no Svelte left. Overlay pages live in `apps/web/assets/js/pages/overlay/**/*.tsx` with components in `apps/web/assets/js/lib/components/overlay/`; admin pages in `apps/web/assets/js/pages/admin/*.tsx` share the `_layout` nav, which is attached through the app-level `layout` option in both entrypoints. Shared UI primitives (button, field, form, textinput, alert) sit in `apps/web/assets/js/lib/components/`. `apps/web/assets/js/app.tsx` (client) and `apps/web/assets/js/ssr.tsx` (server) must stay in sync: same dynamic `./pages/${name}.tsx` resolver, same `layoutFor` rule, same `http` CSRF option. Guard browser-only APIs during SSR; both entrypoints render through `renderToString`.
- Inertia 3 embeds the page in `<script data-page="app" type="application/json">` and renders into `<div id="app" data-server-rendered>`; the v3 adapter reads that script and self-mounts/hydrates (no custom `setup` for CSR). Flash is a top-level `usePage().flash` key, not a prop; dismissal is tracked by flash object identity so a new page re-shows the alert. CSRF uses the axios client from `@inertiajs/core` via `http: { xsrfHeaderName: "x-csrf-token" }`.
- Domain code uses schemas, `*Repo` modules, and single-purpose `Services.*` modules called directly by controllers; there are no `Accounts`, `Configuration`, or `Integration` context facade modules despite legacy tests referencing them. Overlay configuration is the exception: controllers read and write it through `Configuration.Store` (`get/1`, `put/2`, `all/0`), which upserts the `metadata` row and broadcasts `"update_metadata"` on `overlay_room:lobby`.
- Twitch EventSub POSTs flow through `WebhookController` and `Webhooks.Services.HandleWebhookEvent`, then broadcast `"alert"` on `alerts_room:lobby`. `use-alerts.ts` consumes that topic through `/socket/events`.
- `/admin/captions` streams microphone audio directly from the browser to Soniox (`stt-rt-v6`, French to English) with a temporary key issued by `CaptionsController`; the permanent `SONIOX_API_KEY` stays server-side. Caption windows and clear events are published on `overlay_room:lobby` for `/overlay/captions`. Keep the admin page open while translating, use HTTPS or localhost for microphone access, and do not add transcript persistence.
- Webhook signature verification uses the raw request body saved by `Endpoint.copy_req_body/2`; preserve its position before `Plug.Parsers` when changing request parsing.

## Current test baseline

- The full suite is not green: legacy context tests call removed facade APIs, and generated page/channel tests no longer match the implementation (verified: 32 tests, 27 failures). Run focused tests for changed behavior and distinguish new failures from this baseline rather than treating all existing failures as related.

## Release notes

- The app runs migrations automatically outside releases; releases skip that startup migration. The Docker CMD explicitly runs `bin/migrate`, auto-creates the admin from `ADMIN_USERNAME`/`ADMIN_PASSWORD`, then starts the server. Build the backend image with `apps/web/` as the Docker build context.
- `mix admin.create` currently points to the missing `apps/web/lib/scripts/admin_create.exs`; do not rely on it for local admin creation without fixing the alias/script.
