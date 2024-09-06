defmodule TwitchOverlays.Webhooks.Meta do
  def get_available_subscriptions_type("twitch"),
    do: [
      %{"type" => "channel.follow", "name" => "New followers"},
      %{"type" => "channel.subscribe", "name" => "New subscribers"},
      %{"type" => "channel.raid", "name" => "Raid"},
      %{"type" => "channel.subscription.gift", "name" => "Gifts"}
    ]
end
