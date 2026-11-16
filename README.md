# Twtich Overlays

As you may know, I'm a Twitch streamer (and a PARTNER 🔥) at [https://twitch.tv/LLCoolChris_](https://twitch.tv/LLCoolChris_).

I'm also a developer and, when I realized that I can DO cool stuff with clasic web tech for my stream overlays, I went crazy.

Not THAT crazy, but you know this is just a small project that I'm using daily so my stream can be cool to watch.

Feel free to check the code, reuse, blablabla... I'm not going to give instruction or anything like that. Just leave the project as is.

## Repository layout

- `apps/web` — Phoenix backend, React frontend, and overlay assets.
- `apps/desktop` — Electron wrapper for the translated captions page.
- `design` — overlay design documentation.

## Development environment

The repository uses [devenv](https://devenv.sh/) to provide Elixir 1.18 on
Erlang/OTP 28, Node.js 22, pnpm 10, and SQLite. Enter the environment with
`devenv shell`, or run `direnv allow` to activate it automatically when entering
the repository.

### Backend

```sh
cd apps/web
cp .env.example .env # fill in the required Twitch values
mix local.hex --force
mix local.rebar --force
mix setup
mix phx.server
```

Run the test suite with `mix test` from `apps/web`.

### Desktop

With the backend running, use another devenv shell:

```sh
cd apps/desktop
pnpm install
pnpm start
```

### Docker

Build the backend image using its application directory as the build context:

```sh
docker build apps/web
```
