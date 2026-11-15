defmodule TwitchOverlays.Lastfm.Config do
  @moduledoc """
  Last.fm API credentials and the profile whose scrobbles are shown.

  The credentials are stored through the admin configuration. Missing
  credentials disable the integration without preventing the application
  from starting.
  """

  alias TwitchOverlays.Configuration.Store

  @spec get() :: %{api_key: String.t(), username: String.t()} | nil
  def get do
    case Store.get(:lastfm) do
      %{data: data} -> build_config(data)
      nil -> nil
    end
  end

  @spec configured?() :: boolean()
  def configured?, do: get() != nil

  @spec username() :: String.t() | nil
  def username do
    case get() do
      nil -> nil
      config -> config.username
    end
  end

  defp build_config(data) when is_map(data) do
    api_key = blank_to_nil(data["api_key"])
    username = blank_to_nil(data["username"])

    if api_key && username do
      %{api_key: api_key, username: username}
    else
      nil
    end
  end

  defp build_config(_), do: nil

  defp blank_to_nil(value) when is_binary(value) do
    case String.trim(value) do
      "" -> nil
      trimmed -> trimmed
    end
  end

  defp blank_to_nil(_), do: nil
end
