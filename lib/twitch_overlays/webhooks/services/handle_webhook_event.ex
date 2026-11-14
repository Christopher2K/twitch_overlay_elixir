defmodule TwitchOverlays.Webhooks.Services.HandleWebhookEvent do
  require Logger
  import Plug.Conn

  alias TwitchOverlays.Integration.SubscriptionRepo
  alias TwitchOverlays.Webhooks.Alert
  alias TwitchOverlays.Webhooks.ChatMessage

  def call("twitch", conn) do
    [message_type] = conn |> get_req_header("twitch-eventsub-message-type")

    handle_call(message_type, conn)
  end

  def handle_call("notification", conn) do
    subscription_type = conn.body_params["subscription"]["type"]
    event = conn.body_params["event"]

    if subscription_type == "channel.chat.message" do
      # Chat is high-volume, so broadcast inline instead of starting a task.
      TwitchOverlaysWeb.Endpoint.broadcast("chat_room:lobby", "chat", ChatMessage.new(event))
    else
      Task.start(fn -> broadcast_alert(subscription_type, event) end)
    end

    conn |> send_resp(200, "")
  end

  def handle_call("webhook_callback_verification", %Plug.Conn{} = conn) do
    Logger.info("Subscription challenge from Twitch...")
    challenge = conn.body_params["challenge"]

    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, challenge)
  end

  def handle_call("revocation", %Plug.Conn{} = conn) do
    subscription_id = conn.body_params["subscription"]["id"]
    Logger.info("Subscription revoked by Twitch: #{subscription_id}")

    SubscriptionRepo.delete_by_sub_id(subscription_id)
    conn |> send_resp(200, "")
  end

  def handle_call(_, conn) do
    conn |> send_resp(200, "")
  end

  defp broadcast_alert(subscription_type, event) do
    alert =
      case subscription_type do
        "channel.follow" ->
          Alert.new("community |> add()", "Bienvenue #{event["user_name"]}!", "iphone-message")

        "channel.subscribe" ->
          Alert.new(
            "channel |> sub(tier: #{event["tier"]})",
            "Merci #{event["user_name"]}!",
            "apple-pay"
          )

        "channel.raid" ->
          Alert.new(
            "channel |> raid(from: #{event["from_broadcaster_user_name"]})",
            "+#{event["viewers"] |> Integer.to_string()} nerds!",
            "startup-mac-pci"
          )

        "channel.subscription.gift" ->
          gifter_name = if event["user_name"] == nil, do: "anonymous", else: event["user_name"]

          Alert.new(
            "channel |> gift(from: #{gifter_name})",
            "+#{event["total"]} subs!",
            "apple-pay"
          )

        unhandled_event ->
          Logger.info("Unhandled event: #{unhandled_event}")
          nil
      end

    if alert != nil do
      TwitchOverlaysWeb.Endpoint.broadcast(
        "alerts_room:lobby",
        "alert",
        alert
      )
    end
  end
end
