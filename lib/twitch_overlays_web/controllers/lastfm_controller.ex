defmodule TwitchOverlaysWeb.LastfmController do
  require Logger

  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Lastfm.Services.GetNowPlaying

  def now_playing(conn, _params) do
    case GetNowPlaying.call() do
      {:ok, track} ->
        conn
        |> put_resp_header("cache-control", "public, max-age=10")
        |> json(%{track: track})

      {:error, reason} ->
        Logger.warning("Could not load Last.fm now playing: #{inspect(reason)}")

        conn
        |> put_status(:bad_gateway)
        |> json(%{track: nil, error: "Last.fm is unavailable"})
    end
  end
end
