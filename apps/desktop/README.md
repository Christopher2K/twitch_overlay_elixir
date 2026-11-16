# Stream Captions (desktop)

A small macOS app that wraps the overlay server's live translated captions
page (`/admin/captions`), so you don't have to keep a browser tab open while
streaming. Audio still goes directly from this machine to Soniox; captions
are published to the Phoenix server exactly like the browser version, and
the OBS Browser Source at `/overlay/captions` is unchanged.

## Run in development

Requires Node 22 (the repo's mise/asdf toolchain) and the Phoenix server
running (see the root `AGENTS.md`).

```sh
cd apps/desktop
corepack pnpm install
corepack pnpm start
```

On first launch, enter the server address (e.g. `http://localhost:4000`).
Log in with the usual admin credentials — the session cookie persists, so
later launches go straight to the captions page. Use **Captions → Change
Server…** to point at a different server.

Notes:

- The microphone permission is granted automatically for the configured
  server only; macOS will ask for microphone access once.
- Caption publishing keeps running at full speed while the window is
  minimized (`backgroundThrottling` is disabled).
- Closing the window quits the app and clears the published captions.
- Plain `http://` servers that are not `localhost` are registered as a secure
  context so `getUserMedia` works; the app relaunches once when such an
  address is saved.

## Build the app

```sh
corepack pnpm icon   # regenerates build/icon.icns via scripts/make-icon.mjs
corepack pnpm dist   # builds dist/mac-arm64/Stream Captions.app and a .dmg
```

Drag `Stream Captions.app` to `/Applications`. If a signing identity exists in
the keychain, electron-builder signs with it; builds are not notarized, so
they are for local use only.

## Layout

- `main.js` — window, menu, permission handlers, config (`config.json` in
  Electron's `userData` directory), navigation guards.
- `preload.js` — exposes a tiny IPC API to the local setup/error pages only;
  the remote admin page gets no Node access.
- `pages/` — local setup and connection-error screens.
- `scripts/make-icon.mjs` — dependency-free icon generator (PNG + iconutil).