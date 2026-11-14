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

    assert {:ok, _} = Store.put(:guests, %{"members" => [%{"name" => "Ana"}]})
    :ok
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

  test "passes global and guest settings to guest overlays", %{conn: conn} do
    conn = get(conn, ~p"/overlay/audio-guest")
    assert html_response(conn, 200)

    assert %{
             "globalData" => %{"name" => "global"},
             "guestData" => %{"name" => "guests", "data" => %{"members" => [%{"name" => "Ana"}]}}
           } = inertia_props(conn)
  end

  test "renders global settings with the vertical layout", %{conn: conn} do
    conn = get(conn, ~p"/overlay/vertical/computer")
    html = html_response(conn, 200)

    assert html =~ "h-[1920px] w-[1080px]"
    assert %{"globalData" => %{"name" => "global"}} = inertia_props(conn)
    refute Map.has_key?(inertia_props(conn), "layout")
  end

  test "renders the chat overlay at the browser source size", %{conn: conn} do
    conn = get(conn, ~p"/overlay/chat")
    html = html_response(conn, 200)

    assert html =~ "fixed inset-0 overflow-hidden"
    assert html =~ "ov-chat"
    assert %{} = inertia_props(conn)
  end

  test "renders overlays without settings when nothing is stored", %{conn: conn} do
    Repo.delete_all(TwitchOverlays.Configuration.Metadata)

    conn = get(conn, ~p"/overlay/computer")
    assert html_response(conn, 200)

    assert %{"globalData" => nil} = inertia_props(conn)
  end
end
