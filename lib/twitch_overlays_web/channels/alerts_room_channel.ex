defmodule TwitchOverlaysWeb.AlertsRoomChannel do
  use TwitchOverlaysWeb, :channel

  @impl true
  def join("alerts_room:lobby", _, socket), do: {:ok, socket}
end
