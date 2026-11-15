defmodule TwitchOverlays.Lastfm.Services.GetNowPlaying do
  @moduledoc """
  Reads the current track or latest scrobble from Last.fm.

  Returns `{:ok, nil}` when credentials are not configured and `{:error, reason}`
  when Last.fm cannot answer.
  """

  require Logger

  alias TwitchOverlays.Lastfm.Config

  @endpoint "https://ws.audioscrobbler.com/2.0/"
  @image_sizes ~w(extralarge large medium small)

  @spec call(keyword()) :: {:ok, map() | nil} | {:error, term()}
  def call(req_options \\ []) do
    case Config.get() do
      nil -> {:ok, nil}
      config -> fetch(config, req_options)
    end
  end

  defp fetch(config, req_options) do
    params = [
      method: "user.getRecentTracks",
      user: config.username,
      api_key: config.api_key,
      format: "json",
      limit: 2,
      extended: 1
    ]

    options = Keyword.merge([params: params, receive_timeout: 5_000, retry: false], req_options)

    case Req.get(@endpoint, options) do
      {:ok, %{status: 200, body: %{"error" => code, "message" => message}}} ->
        Logger.warning("Last.fm request failed (#{code}): #{message}")
        {:error, {:lastfm, code, message}}

      {:ok, %{status: 200, body: body}} ->
        {:ok, normalize(body)}

      {:ok, %{status: status}} ->
        Logger.warning("Last.fm request returned HTTP #{status}")
        {:error, {:http, status}}

      {:error, reason} ->
        Logger.warning("Last.fm request failed: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp normalize(%{"recenttracks" => %{"track" => tracks}}) when is_list(tracks) do
    tracks
    |> List.first()
    |> normalize_track()
  end

  defp normalize(%{"recenttracks" => %{"track" => track}}) when is_map(track) do
    normalize_track(track)
  end

  defp normalize(_), do: nil

  defp normalize_track(%{"name" => name} = track) when is_binary(name) do
    %{
      name: String.trim(name),
      artist: text(track["artist"]),
      album: text(track["album"]),
      artwork: artwork_url(track["image"]),
      url: track["url"],
      isPlaying: get_in(track, ["@attr", "nowplaying"]) == "true"
    }
    |> Enum.reject(fn {_key, value} -> value in [nil, ""] end)
    |> Map.new()
  end

  defp normalize_track(_), do: nil

  defp text(%{"#text" => value}), do: text(value)
  defp text(value) when is_binary(value), do: value |> String.trim() |> blank_to_nil()
  defp text(_), do: nil

  defp artwork_url(images) when is_list(images) do
    Enum.find_value(@image_sizes, fn size ->
      case Enum.find(images, &(&1["size"] == size)) do
        %{"#text" => url} -> blank_to_nil(url)
        _ -> nil
      end
    end)
  end

  defp artwork_url(_), do: nil

  defp blank_to_nil(value) when is_binary(value) do
    case String.trim(value) do
      "" -> nil
      trimmed -> trimmed
    end
  end

  defp blank_to_nil(_), do: nil
end
