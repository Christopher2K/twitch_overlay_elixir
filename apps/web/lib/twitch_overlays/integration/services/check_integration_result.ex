defmodule TwitchOverlays.Integration.Services.ExchangeAuthorizationCode do
  require Logger

  @id_twitch "https://id.twitch.tv"

  def call("twitch", code) do
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]

    url = @id_twitch <> "/oauth2/token"

    Req.post(url,
      form: [
        client_id: twitch_config[:client_id],
        client_secret: twitch_config[:client_secret],
        redirect_uri: twitch_config[:redirect_uri],
        grant_type: "authorization_code",
        code: code
      ]
    )
    |> case do
      {:ok, %{status: 200, body: body}} ->
        {:ok, %{"access_token" => body["access_token"], "refresh_token" => body["refresh_token"]}}

      {:ok, response} ->
        Logger.error("Error while exchanging authorization code: #{inspect(response)}")
        {:error, :bad_gateway}

      {:error, error} ->
        Logger.error("Error while exchanging authorization code: #{inspect(error)}")
        {:error, :bad_gateway}
    end
  end
end
