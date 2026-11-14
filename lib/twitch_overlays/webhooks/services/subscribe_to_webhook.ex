defmodule TwitchOverlays.Webhooks.Services.SubscribeToWebhook do
  require Logger
  alias TwitchOverlays.Integration.PlatformRepo
  alias TwitchOverlays.Integration.Workers.TwitchAppTokenWorker
  alias TwitchOverlays.Integration.SubscriptionRepo

  @twitch_endpoint "https://api.twitch.tv/helix/eventsub/subscriptions"
  @twitch_users_endpoint "https://api.twitch.tv/helix/users"
  # Hardcoded, but once again, don't care
  @twitch_user_id "153701872"

  def call("twitch" = platform, "channel.follow" = type),
    do:
      handle_call(platform, type, %{
        "version" => "2",
        "condition" => %{
          "broadcaster_user_id" => @twitch_user_id,
          "moderator_user_id" => @twitch_user_id
        }
      })

  def call("twitch" = platform, "channel.subscribe" = type),
    do:
      handle_call(platform, type, %{
        "version" => "1",
        "condition" => %{
          "broadcaster_user_id" => @twitch_user_id
        }
      })

  def call("twitch" = platform, "channel.subscription.gift" = type),
    do:
      handle_call(platform, type, %{
        "version" => "1",
        "condition" => %{
          "broadcaster_user_id" => @twitch_user_id
        }
      })

  def call("twitch" = platform, "channel.raid" = type),
    do:
      handle_call(platform, type, %{
        "version" => "1",
        "condition" => %{
          "to_broadcaster_user_id" => @twitch_user_id
        }
      })

  # Chat subscriptions read chat as the connected user, so they need that
  # Twitch only accepts app tokens when creating webhook subscriptions, and the
  # app token is authorized by the scopes the broadcaster granted (`user:read:chat`,
  # `user:bot`, and `channel:bot`). The stored user token is only needed to look
  # up the connected account's id.
  def call("twitch" = platform, "channel.chat.message" = type) do
    with {:ok, user_token} <- user_token(),
         {:ok, user_id} <- user_id(user_token) do
      handle_call(platform, type, %{
        "version" => "1",
        "condition" => %{"broadcaster_user_id" => user_id, "user_id" => user_id}
      })
    end
  end

  def handle_call("twitch" = platform, type, args) do
    Logger.info("Subscribe to the #{type} event")
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]
    client_id = twitch_config[:client_id]
    token = TwitchAppTokenWorker.get_token()

    Req.post(@twitch_endpoint,
      auth: {:bearer, token},
      headers: %{"client-id" => client_id},
      json:
        %{
          "type" => type,
          "transport" => %{
            "method" => "webhook",
            "callback" => twitch_config[:webhook_callback_uri],
            "secret" => twitch_config[:webhook_secret]
          }
        }
        |> Map.merge(args)
    )
    |> case do
      {:ok, %Req.Response{status: 202, body: body}} ->
        SubscriptionRepo.upsert(type, platform, %{
          "type" => type,
          "sub_id" => Enum.at(body["data"], 0)["id"],
          "platform" => platform
        })

      {status, response} ->
        Logger.error("Unexpected error #{inspect(status)}, #{inspect(response)}")
        {:error, :bad_gateway}
    end
  end

  defp user_token do
    case PlatformRepo.get_by_name("twitch") do
      {:ok, %{access_token: token}} when is_binary(token) -> {:ok, token}
      _ -> {:error, :not_connected}
    end
  end

  defp user_id(user_token) do
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]

    Req.get(@twitch_users_endpoint,
      auth: {:bearer, user_token},
      headers: %{"client-id" => twitch_config[:client_id]}
    )
    |> case do
      {:ok, %Req.Response{status: 200, body: %{"data" => [%{"id" => id} | _]}}} ->
        {:ok, id}

      response ->
        Logger.error("Could not read the Twitch user: #{inspect(response)}")
        {:error, :bad_gateway}
    end
  end
end
