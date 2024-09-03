defmodule TwitchOverlaysWeb.OverlayController do
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Configuration.Services, as: MetadataServices

  def index(conn, _),
    do: conn |> assign(:bg_class, "") |> render(:index)

  def start_overlay(conn, _),
    do:
      conn
      |> assign(:bg_class, "bg-video-background")
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

  def computer_overlay(conn, _) do
    global_data =
      case MetadataServices.GetMetadata.call("global") do
        {:ok, global} -> global
        _ -> nil
      end

    conn
    |> assign_prop("globalData", global_data)
    |> put_layout(html: :overlay)
    |> render_inertia("overlay/computer")
  end

  def talk_overlay(conn, _) do
    global_data =
      case MetadataServices.GetMetadata.call("global") do
        {:ok, global} -> global
        _ -> nil
      end

    conn
    |> assign_prop("globalData", global_data)
    |> put_layout(html: :overlay)
    |> render_inertia("overlay/talk")
  end

  def audio_guest_overlay(conn, _) do
    global_data =
      case MetadataServices.GetMetadata.call("global") do
        {:ok, global} -> global
        _ -> nil
      end

    guest_data =
      case MetadataServices.GetMetadata.call("guests") do
        {:ok, guests} -> guests
        _ -> nil
      end

    conn
    |> assign_prop("globalData", global_data)
    |> assign_prop("guestData", guest_data)
    |> put_layout(html: :overlay)
    |> render_inertia("overlay/audio-guest")
  end

  def video_guest_overlay(conn, _) do
    global_data =
      case MetadataServices.GetMetadata.call("global") do
        {:ok, global} -> global
        _ -> nil
      end

    guest_data =
      case MetadataServices.GetMetadata.call("guests") do
        {:ok, guests} -> guests
        _ -> nil
      end

    conn
    |> assign_prop("globalData", global_data)
    |> assign_prop("guestData", guest_data)
    |> put_layout(html: :overlay)
    |> render_inertia("overlay/video-guest")
  end

  def computer_guest_overlay(conn, _) do
    global_data =
      case MetadataServices.GetMetadata.call("global") do
        {:ok, global} -> global
        _ -> nil
      end

    guest_data =
      case MetadataServices.GetMetadata.call("guests") do
        {:ok, guests} -> guests
        _ -> nil
      end

    conn
    |> assign_prop("globalData", global_data)
    |> assign_prop("guestData", guest_data)
    |> put_layout(html: :overlay)
    |> render_inertia("overlay/computer-guest")
  end

  def alerts_overlay(conn, _),
    do:
      conn
      |> assign(:bg_class, "")
      |> put_layout(html: :overlay)
      |> render_inertia("overlay/alerts")
end
