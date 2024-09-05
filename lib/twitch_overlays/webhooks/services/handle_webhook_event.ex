defmodule TwitchOverlays.Webhooks.Services.HandleWebhookEvent do
  require Logger
  import Plug.Conn

  alias TwitchOverlays.Webhooks.Alert

  def call("twitch", conn) do
    [message_type] = conn |> get_req_header("twitch-eventsub-message-type")

    handle_call(message_type, conn)
  end

  def handle_call("notification", conn) do
    subscription_type = conn.body_params["subscription"]["type"]
    event = conn.body_params["event"]

    Task.start(fn ->
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
            Logger.debug("Unhandled event: #{unhandled_event}")
            nil
        end

      if alert != nil do
        TwitchOverlaysWeb.Endpoint.broadcast(
          "alerts_room:lobby",
          "alert",
          alert
        )
      end
    end)

    conn |> send_resp(200, "")
  end

  def handle_call("webhook_callback_verification", %Plug.Conn{} = conn) do
    Logger.debug("Subscription challenge from Twitch...")
    challenge = conn.body_params["challenge"]

    conn
    |> put_resp_content_type("text/plain")
    |> send_resp(200, challenge)
  end

  # def handle_call("revocation", conn) do
  #   # Remove the subscrition from the database
  # end

  def handle_call(_, conn) do
    conn |> send_resp(200, "")
  end
end
