defmodule TwitchOverlaysWeb.ChatRoomChannelTest do
  use TwitchOverlaysWeb.ChannelCase

  test "joins the chat lobby" do
    {:ok, _, socket} =
      socket(TwitchOverlaysWeb.EventsSocket, nil, %{})
      |> subscribe_and_join(TwitchOverlaysWeb.ChatRoomChannel, "chat_room:lobby")

    assert socket.topic == "chat_room:lobby"
  end
end
