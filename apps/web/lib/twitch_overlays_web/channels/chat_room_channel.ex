defmodule TwitchOverlaysWeb.ChatRoomChannel do
  use TwitchOverlaysWeb, :channel

  @impl true
  def join("chat_room:lobby", _, socket), do: {:ok, socket}
end
