defmodule TwitchOverlays.Webhooks.ChatMessageTest do
  use ExUnit.Case, async: true

  alias TwitchOverlays.Webhooks.ChatMessage

  defp event(attrs) do
    Map.merge(
      %{
        "message_id" => "message-1",
        "chatter_user_name" => "pixelpete",
        "color" => "",
        "badges" => [],
        "message" => %{"fragments" => [%{"type" => "text", "text" => "hi"}]}
      },
      attrs
    )
  end

  test "the broadcaster badge outranks moderator, vip, and subscriber" do
    message =
      ChatMessage.new(
        event(%{
          "badges" => [
            %{"set_id" => "subscriber"},
            %{"set_id" => "vip"},
            %{"set_id" => "moderator"},
            %{"set_id" => "broadcaster"}
          ]
        })
      )

    assert message.badge == "host"
  end

  test "founder counts as a sub badge" do
    message = ChatMessage.new(event(%{"badges" => [%{"set_id" => "founder"}]}))

    assert message.badge == "sub"
  end

  test "drops an empty or malformed color" do
    assert ChatMessage.new(event(%{"color" => ""})).color == nil
    assert ChatMessage.new(event(%{"color" => "green"})).color == nil
  end

  test "marks animated emote fragments" do
    message =
      ChatMessage.new(
        event(%{
          "message" => %{
            "fragments" => [
              %{
                "type" => "emote",
                "text" => "PogChamp",
                "emote" => %{"id" => "305954156", "format" => ["static", "animated"]}
              }
            ]
          }
        })
      )

    assert message.fragments == [
             %{
               "type" => "emote",
               "text" => "PogChamp",
               "emote_id" => "305954156",
               "animated" => true
             }
           ]
  end

  test "renders other fragment types as text" do
    message =
      ChatMessage.new(
        event(%{
          "message" => %{
            "fragments" => [
              %{
                "type" => "mention",
                "text" => "@streamer",
                "mention" => %{"user_name" => "streamer"}
              }
            ]
          }
        })
      )

    assert message.fragments == [%{"type" => "text", "text" => "@streamer"}]
  end
end
