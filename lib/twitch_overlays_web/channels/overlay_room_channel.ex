defmodule TwitchOverlaysWeb.OverlayRoomChannel do
  use TwitchOverlaysWeb, :channel

  @impl true
  def join("overlay_room:lobby", _, socket), do: {:ok, socket}
end
