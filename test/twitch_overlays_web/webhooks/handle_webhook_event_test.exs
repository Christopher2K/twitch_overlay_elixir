defmodule TwitchOverlaysWeb.Webhooks.HandleWebhookEventTest do
  use TwitchOverlaysWeb.ConnCase

  alias TwitchOverlays.Integration.SubscriptionRepo
  alias TwitchOverlays.Webhooks.ChatMessage
  alias TwitchOverlays.Webhooks.Services.HandleWebhookEvent

  @moduletag :capture_log

  test "broadcasts chat messages with a badge and emote fragments" do
    TwitchOverlaysWeb.Endpoint.subscribe("chat_room:lobby")

    conn =
      build_conn(:post, "/webhooks/twitch-event", %{
        "subscription" => %{"type" => "channel.chat.message"},
        "event" => %{
          "message_id" => "message-1",
          "chatter_user_name" => "pixelpete",
          "color" => "#00FF7F",
          "badges" => [
            %{"set_id" => "moderator", "id" => "1", "info" => ""},
            %{"set_id" => "subscriber", "id" => "12", "info" => "16"}
          ],
          "message" => %{
            "fragments" => [
              %{"type" => "text", "text" => "hello "},
              %{
                "type" => "emote",
                "text" => "Kappa",
                "emote" => %{"id" => "25", "format" => ["static"]}
              }
            ]
          }
        }
      })
      |> put_req_header("twitch-eventsub-message-type", "notification")

    conn = HandleWebhookEvent.call("twitch", conn)

    assert conn.status == 200

    assert_receive %Phoenix.Socket.Broadcast{
      topic: "chat_room:lobby",
      event: "chat",
      payload: %ChatMessage{} = message
    }

    assert message.id == "message-1"
    assert message.author == "pixelpete"
    assert message.color == "#00FF7F"
    assert message.badge == "mod"
    assert message.sent_at

    assert message.fragments == [
             %{"type" => "text", "text" => "hello "},
             %{"type" => "emote", "text" => "Kappa", "emote_id" => "25", "animated" => false}
           ]
  end

  test "removes a revoked subscription" do
    assert {:ok, _subscription} =
             SubscriptionRepo.upsert("channel.chat.message", "twitch", %{
               "type" => "channel.chat.message",
               "sub_id" => "subscription-1",
               "platform" => "twitch"
             })

    conn =
      build_conn(:post, "/webhooks/twitch-event", %{
        "subscription" => %{"id" => "subscription-1"}
      })
      |> put_req_header("twitch-eventsub-message-type", "revocation")

    assert HandleWebhookEvent.call("twitch", conn).status == 200

    assert SubscriptionRepo.get_by_type_and_service("channel.chat.message", "twitch") ==
             {:error, :not_found}
  end
end
