defmodule TwitchOverlays.Repo do
  use Ecto.Repo,
    otp_app: :twitch_overlays,
    adapter: Ecto.Adapters.SQLite3
end
