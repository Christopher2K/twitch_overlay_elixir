defmodule TwitchOverlaysWeb.OverlayController do
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Configuration.Store

  def index(conn, _), do: render(conn, :index)

  def start_overlay(conn, _),
    do: render_overlay(conn, "overlay/start", layout: :transparent_overlay)

  def end_overlay(conn, _),
    do: render_overlay(conn, "overlay/end", layout: :transparent_overlay)

  def brb_overlay(conn, _),
    do: render_overlay(conn, "overlay/brb", layout: :transparent_overlay)

  def computer_overlay(conn, _),
    do: render_overlay(conn, "overlay/computer", props: [globalData: Store.get(:global)])

  def computer_small_overlay(conn, _),
    do: render_overlay(conn, "overlay/computer-small", props: [globalData: Store.get(:global)])

  def computer_built_in_overlay(conn, _),
    do: render_overlay(conn, "overlay/computer-built-in", props: [globalData: Store.get(:global)])

  def talk_overlay(conn, _),
    do: render_overlay(conn, "overlay/talk", props: [globalData: Store.get(:global)])

  def audio_guest_overlay(conn, _),
    do:
      render_overlay(conn, "overlay/audio-guest",
        props: [globalData: Store.get(:global), guestData: Store.get(:guests)]
      )

  def video_guest_overlay(conn, _),
    do:
      render_overlay(conn, "overlay/video-guest",
        props: [globalData: Store.get(:global), guestData: Store.get(:guests)]
      )

  def computer_guest_overlay(conn, _),
    do:
      render_overlay(conn, "overlay/computer-guest",
        props: [globalData: Store.get(:global), guestData: Store.get(:guests)]
      )

  def alerts_overlay(conn, _), do: render_overlay(conn, "overlay/alerts")

  def vertical_start_overlay(conn, _),
    do: render_overlay(conn, "overlay/vertical/start", layout: :vertical_transparent_overlay)

  def vertical_end_overlay(conn, _),
    do: render_overlay(conn, "overlay/vertical/end", layout: :vertical_transparent_overlay)

  def vertical_brb_overlay(conn, _),
    do: render_overlay(conn, "overlay/vertical/brb", layout: :vertical_transparent_overlay)

  def vertical_computer_overlay(conn, _),
    do:
      render_overlay(conn, "overlay/vertical/computer",
        layout: :vertical_overlay,
        props: [globalData: Store.get(:global)]
      )

  def vertical_talk_overlay(conn, _),
    do:
      render_overlay(conn, "overlay/vertical/talk",
        layout: :vertical_overlay,
        props: [globalData: Store.get(:global)]
      )

  defp render_overlay(conn, page, opts \\ []) do
    layout = Keyword.get(opts, :layout, :overlay)
    props = Keyword.get(opts, :props, [])

    conn
    |> assign_overlay_props(props)
    |> put_layout(html: {TwitchOverlaysWeb.Layouts, layout})
    |> render_inertia(page)
  end

  defp assign_overlay_props(conn, props) do
    Enum.reduce(props, conn, fn {key, value}, conn -> assign_prop(conn, key, value) end)
  end
end
