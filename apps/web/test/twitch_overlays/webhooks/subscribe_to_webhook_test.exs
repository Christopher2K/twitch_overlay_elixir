defmodule TwitchOverlays.Webhooks.SubscribeToWebhookTest do
  use ExUnit.Case, async: true

  alias TwitchOverlays.Webhooks.Services.SubscribeToWebhook

  describe "conflicting_subscription_ids/3" do
    test "reads the id out of the conflict message Twitch returns" do
      body = %{
        "error" => "Conflict",
        "message" => "subscription already exists; id=86585228-7302-4989-8d67-f0e25363bf0c",
        "status" => 409
      }

      assert SubscribeToWebhook.conflicting_subscription_ids(
               "channel.follow",
               body,
               %{}
             ) == ["86585228-7302-4989-8d67-f0e25363bf0c"]
    end
  end
end
