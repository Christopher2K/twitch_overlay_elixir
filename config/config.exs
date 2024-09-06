# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :twitch_overlays,
  ecto_repos: [TwitchOverlays.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :twitch_overlays, TwitchOverlaysWeb.Endpoint,
  url: [host: "localcan.dev"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: TwitchOverlaysWeb.ErrorHTML, json: TwitchOverlaysWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: TwitchOverlays.PubSub,
  live_view: [signing_salt: "cGX7mtr6"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :twitch_overlays, TwitchOverlays.Mailer, adapter: Swoosh.Adapters.Local

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.3",
  twitch_overlays: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.css
      --output=../priv/static/assets/tailwind.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :inertia,
  endpoint: TwitchOverlaysWeb.Endpoint,
  static_paths: ["/assets/app.js"],
  default_version: "1",
  ssr: true,
  raise_on_ssr_failture: config_env() != :prod

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
