defmodule TwitchOverlays.Integration.Services.GetTwitchAppToken do
  require Logger

  @id_twitch "https://id.twitch.tv"

  def call() do
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]

    url = @id_twitch <> "/oauth2/token?"

    Req.post(url,
      form: [
        client_id: twitch_config[:client_id],
        client_secret: twitch_config[:client_secret],
        grant_type: "client_credentials"
      ]
    )
    |> case do
      {:ok, %{status: 200, body: body}} ->
        {:ok, %{"access_token" => body["access_token"], "expires_in" => body["expires_in"]}}

      {:ok, response} ->
        Logger.error("Error while exchanging authorization code: #{inspect(response)}")
        {:error, :bad_gateway}

      {:error, error} ->
        Logger.error("Error while exchanging authorization code: #{inspect(error)}")
        {:error, :bad_gateway}
    end
  end
end
