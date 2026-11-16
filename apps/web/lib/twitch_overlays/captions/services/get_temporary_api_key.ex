defmodule TwitchOverlays.Captions.Services.GetTemporaryApiKey do
  @moduledoc """
  Exchanges the server-side Soniox key for a short-lived browser key.
  """

  @endpoint "https://api.soniox.com/v1/auth/temporary-api-key"
  @expires_in_seconds 3_600

  @spec configured?() :: boolean()
  def configured?, do: is_binary(api_key()) and api_key() != ""

  @spec call(keyword()) :: {:ok, map()} | {:error, term()}
  def call(req_options \\ []) do
    case api_key() do
      key when is_binary(key) and key != "" -> request(key, req_options)
      _ -> {:error, :not_configured}
    end
  end

  defp request(api_key, req_options) do
    options =
      Keyword.merge(
        [
          auth: {:bearer, api_key},
          json: %{usage_type: "transcribe_websocket", expires_in_seconds: @expires_in_seconds},
          receive_timeout: 10_000,
          retry: false
        ],
        req_options
      )

    case Req.post(@endpoint, options) do
      {:ok, %{status: status, body: %{"api_key" => key, "expires_at" => expires_at}}}
      when status in 200..299 and is_binary(key) and is_binary(expires_at) ->
        {:ok, %{api_key: key, expires_at: expires_at}}

      {:ok, %{status: status}} ->
        {:error, {:soniox_http, status}}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp api_key do
    :twitch_overlays
    |> Application.get_env(:soniox, [])
    |> Keyword.get(:api_key)
  end
end
