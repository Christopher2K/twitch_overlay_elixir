defmodule TwitchOverlaysWeb.OverlayController do
  use TwitchOverlaysWeb, :controller

  def index(conn, _),
    do:
      conn
      |> assign(:has_video_bg, true)
      |> render(:index)

  def start_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/start")

  def end_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/end")

  def brb_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/brb")

  def computer_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/computer")

  def talk_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/talk")

  def audio_guest_overlay(conn, _),
    do:
      conn
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/audio-guest")
end
