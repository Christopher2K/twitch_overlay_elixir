defmodule TwitchOverlaysWeb.OverlayControllerTest do
  use TwitchOverlaysWeb.ConnCase

  alias TwitchOverlays.Configuration.Store
  alias TwitchOverlays.Repo

  setup do
    assert {:ok, _} =
             Store.put(:global, %{
               "banner" => "live",
               "title" => "Live coding",
               "focusMode" => false
             })

    :ok
  end

  test "lists every available overlay in the registry", %{conn: conn} do
    html = conn |> get(~p"/") |> html_response(200)

    for path <- [
          "/overlay/start",
          "/overlay/end",
          "/overlay/brb",
          "/overlay/computer",
          "/overlay/talk",
          "/overlay/overhead",
          "/overlay/alerts",
          "/overlay/chat",
          "/overlay/captions",
          "/overlay/vertical/start",
          "/overlay/vertical/end",
          "/overlay/vertical/brb",
          "/overlay/vertical/computer",
          "/overlay/vertical/talk",
          "/overlay/vertical/overhead",
          "/overlay/vertical/alerts"
        ] do
      assert html =~ ~s(href="#{path}")
    end

    for path <- [
          "/overlay/computer-small",
          "/overlay/computer-built-in",
          "/overlay/audio-guest",
          "/overlay/video-guest",
          "/overlay/computer-guest"
        ] do
      refute html =~ path
    end
  end

  test "passes the global settings to the computer overlay", %{conn: conn} do
    conn = get(conn, ~p"/overlay/computer")
    html = html_response(conn, 200)

    assert %{
             "globalData" => %{
               "name" => "global",
               "data" => %{"title" => "Live coding", "focusMode" => false}
             }
           } = inertia_props(conn)

    refute Map.has_key?(inertia_props(conn), "layout")
    assert html =~ "h-[1080px] w-[1920px]"
  end

  test "renders the overhead overlay full-bleed with the global banner", %{conn: conn} do
    conn = get(conn, ~p"/overlay/overhead")
    html = html_response(conn, 200)

    assert html =~ ~s(left:0;top:0;width:1920px;height:1080px)
    assert html =~ "overhead"
    assert html =~ "Live coding"
    assert %{"globalData" => %{"name" => "global"}} = inertia_props(conn)
  end

  test "renders the vertical overhead overlay full-bleed", %{conn: conn} do
    conn = get(conn, ~p"/overlay/vertical/overhead")
    html = html_response(conn, 200)

    assert html =~ ~s(left:0;top:0;width:1080px;height:1920px)
    assert html =~ "ov-root--vertical"
    assert %{"globalData" => %{"name" => "global"}} = inertia_props(conn)
  end

  test "renders global settings with the vertical layout", %{conn: conn} do
    conn = get(conn, ~p"/overlay/vertical/computer")
    html = html_response(conn, 200)

    assert html =~ "h-[1920px] w-[1080px]"
    assert %{"globalData" => %{"name" => "global"}} = inertia_props(conn)
    refute Map.has_key?(inertia_props(conn), "layout")
  end

  test "renders the alerts overlay with a transparent background", %{conn: conn} do
    conn = get(conn, ~p"/overlay/alerts")
    html = html_response(conn, 200)

    assert html =~ "fixed top-0 left-0 h-[1080px] w-[1920px] overflow-hidden"
    refute html =~ "ov-canvas"
  end

  test "renders the vertical alerts overlay with a transparent background", %{conn: conn} do
    conn = get(conn, ~p"/overlay/vertical/alerts")
    html = html_response(conn, 200)

    assert html =~ "fixed top-0 left-0 h-[1920px] w-[1080px] overflow-hidden"
    refute html =~ "ov-canvas"
    assert %{"variant" => "vertical"} = inertia_props(conn)
  end

  test "renders the chat overlay at the browser source size", %{conn: conn} do
    conn = get(conn, ~p"/overlay/chat")
    html = html_response(conn, 200)

    assert html =~ "fixed inset-0 overflow-hidden"
    assert html =~ "ov-chat"
    assert %{} = inertia_props(conn)
  end

  test "renders the captions overlay at the browser source size", %{conn: conn} do
    conn = get(conn, ~p"/overlay/captions")
    html = html_response(conn, 200)

    assert html =~ "fixed inset-0 overflow-hidden"
    assert html =~ "ov-root"
    assert %{} = inertia_props(conn)
  end

  test "renders overlays without settings when nothing is stored", %{conn: conn} do
    Repo.delete_all(TwitchOverlays.Configuration.Metadata)

    conn = get(conn, ~p"/overlay/computer")
    assert html_response(conn, 200)

    assert %{"globalData" => nil} = inertia_props(conn)
  end
end
