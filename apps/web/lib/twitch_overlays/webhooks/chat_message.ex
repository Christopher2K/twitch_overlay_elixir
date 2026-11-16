defmodule TwitchOverlays.Webhooks.ChatMessage do
  @moduledoc """
  Payload broadcast to the chat overlay for one Twitch chat message.

  Built from a `channel.chat.message` event. Text is split into fragments so
  the overlay can render Twitch emotes as images and everything else as text.
  """

  @derive Jason.Encoder
  @enforce_keys [:id, :author, :fragments, :sent_at]
  defstruct [:id, :author, :fragments, :sent_at, color: nil, badge: nil]

  def new(event) do
    %__MODULE__{
      id: event["message_id"],
      author: event["chatter_user_name"],
      color: normalize_color(event["color"]),
      badge: badge(event["badges"] || []),
      fragments: fragments((event["message"] || %{})["fragments"] || []),
      sent_at: DateTime.utc_now() |> DateTime.to_iso8601()
    }
  end

  # The overlay shows one badge; the most prominent one wins.
  defp badge(badges) do
    set_ids = Enum.map(badges, & &1["set_id"])

    cond do
      "broadcaster" in set_ids -> "host"
      "moderator" in set_ids -> "mod"
      "vip" in set_ids -> "vip"
      "subscriber" in set_ids or "founder" in set_ids -> "sub"
      true -> nil
    end
  end

  defp fragments(fragments) do
    Enum.map(fragments, fn fragment ->
      case fragment["type"] do
        "emote" ->
          emote = fragment["emote"] || %{}

          %{
            "type" => "emote",
            "text" => fragment["text"],
            "emote_id" => emote["id"],
            "animated" => "animated" in (emote["format"] || [])
          }

        _ ->
          %{"type" => "text", "text" => fragment["text"]}
      end
    end)
  end

  defp normalize_color(color) when is_binary(color) do
    if Regex.match?(~r/^#[0-9a-fA-F]{6}$/, color), do: color, else: nil
  end

  defp normalize_color(_), do: nil
end
