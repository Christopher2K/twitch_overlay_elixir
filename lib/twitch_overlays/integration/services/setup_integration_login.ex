defmodule TwitchOverlays.Integration.Services.SetupIntegrationLogin do
  @id_twitch "https://id.twitch.tv"

  def call(conn, "twitch") do
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]

    base_url = @id_twitch <> "/oauth2/authorize"

    client_id = twitch_config[:client_id]
    redirect_uri = twitch_config[:redirect_uri]
    state = generate_state()

    scope =
      [
        "bits:read",
        "channel:moderate",
        "channel:read:subscriptions",
        "chat:edit",
        "chat:read",
        "moderation:read",
        "moderator:read:followers",
        "user:read:email",
        "user:read:subscriptions"
      ]
      |> Enum.join(" ")

    external_url =
      (base_url <> "?")
      |> Kernel.<>(
        URI.encode_query(
          %{
            "client_id" => client_id,
            "force_verify" => true,
            "redirect_uri" => redirect_uri,
            "response_type" => "code",
            "state" => state,
            "scope" => scope
          },
          :rfc3986
        )
      )

    {:ok,
     [
       conn:
         conn
         |> Plug.Conn.put_session(:twitch_oauth_state, state),
       external_url: external_url
     ]}
  end

  def generate_state do
    :crypto.strong_rand_bytes(32)
    |> Base.url_encode64(padding: false)
  end
end
