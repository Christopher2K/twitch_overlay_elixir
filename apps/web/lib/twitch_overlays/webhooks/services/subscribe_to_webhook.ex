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
    twitch_config = twitch_config()

    case create(type, args, twitch_config) do
      {:ok, %Req.Response{status: 202, body: body}} ->
        store(type, platform, body)

      {:ok, %Req.Response{status: 409, body: body}} ->
        # Subscriptions belong to the Twitch client id, not to a deployment, so
        # one created by another instance (a dev tunnel, a previous host) makes
        # this create conflict and keeps receiving the events instead. EventSub
        # has no update endpoint, so the existing subscription is unsubscribed
        # and created again with this instance's callback.
        Logger.info(
          "Subscription already exists, unsubscribing then subscribing again: #{inspect(body)}"
        )

        with :ok <- unsubscribe_conflicts(type, body, twitch_config),
             {:ok, %Req.Response{status: 202, body: body}} <- create(type, args, twitch_config) do
          store(type, platform, body)
        else
          error ->
            Logger.error("Could not recreate the #{type} subscription: #{inspect(error)}")
            {:error, :bad_gateway}
        end

      {status, response} ->
        Logger.error("Unexpected error #{inspect(status)}, #{inspect(response)}")
        {:error, :bad_gateway}
    end
  end

  defp create(type, args, twitch_config) do
    Req.post(@twitch_endpoint,
      auth: {:bearer, TwitchAppTokenWorker.get_token()},
      headers: %{"client-id" => twitch_config[:client_id]},
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
  end

  defp store(type, platform, body) do
    SubscriptionRepo.upsert(type, platform, %{
      "type" => type,
      "sub_id" => get_in(body, ["data", Access.at(0), "id"]),
      "platform" => platform
    })
  end

  defp unsubscribe_conflicts(type, body, twitch_config) do
    type
    |> conflicting_subscription_ids(body, twitch_config)
    |> Enum.each(&delete_subscription(&1, twitch_config))
  end

  # Twitch answers 409 with the conflicting id ("subscription already exists;
  # id=86585228-…"); the list endpoint is the fallback if that message changes.
  def conflicting_subscription_ids(type, body, twitch_config) do
    case Regex.run(~r/id=([0-9a-fA-F-]{36})/, inspect(body)) do
      [_, id] -> [id]
      _ -> list_subscription_ids(type, twitch_config)
    end
  end

  defp list_subscription_ids(type, twitch_config) do
    Req.get(@twitch_endpoint,
      auth: {:bearer, TwitchAppTokenWorker.get_token()},
      headers: %{"client-id" => twitch_config[:client_id]}
    )
    |> case do
      {:ok, %Req.Response{status: 200, body: %{"data" => data}}} ->
        data |> Enum.filter(&(&1["type"] == type)) |> Enum.map(& &1["id"])

      _ ->
        []
    end
  end

  defp delete_subscription(sub_id, twitch_config) do
    Logger.info("Unsubscribing from the existing Twitch subscription #{sub_id}")

    Req.delete(@twitch_endpoint <> "?id=" <> URI.encode_www_form(sub_id),
      auth: {:bearer, TwitchAppTokenWorker.get_token()},
      headers: %{"client-id" => twitch_config[:client_id]}
    )
    |> case do
      # 404 means it disappeared between the conflict and this call, so the
      # subscribe that follows is safe either way.
      {:ok, %Req.Response{status: status}} when status in [204, 404] ->
        :ok

      other ->
        Logger.warning("Could not unsubscribe #{sub_id}: #{inspect(other)}")
        :ok
    end
  end

  defp twitch_config, do: Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]

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
