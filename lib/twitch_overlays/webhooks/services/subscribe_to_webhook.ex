defmodule TwitchOverlays.Webhooks.Services.SubscribeToWebhook do
  require Logger
  alias TwitchOverlays.Integration.Workers.TwitchAppTokenWorker
  alias TwitchOverlays.Integration.SubscriptionRepo

  @twitch_endpoint "https://api.twitch.tv/helix/eventsub/subscriptions"
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

  def handle_call("twitch" = platform, type, args) do
    Logger.debug("Subscribe to the #{type} event")
    twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]
    client_id = twitch_config[:client_id]
    app_token = TwitchAppTokenWorker.get_token()

    Req.post(@twitch_endpoint,
      auth: {:bearer, app_token},
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
end
