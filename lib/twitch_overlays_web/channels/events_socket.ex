defmodule TwitchOverlaysWeb.EventsSocket do
  use Phoenix.Socket

  channel "overlay_room:*", TwitchOverlaysWeb.OverlayRoomChannel

  @impl true
  def connect(_params, socket, _connect_info), do: {:ok, socket}

  @impl true
  def id(_socket), do: nil
end
