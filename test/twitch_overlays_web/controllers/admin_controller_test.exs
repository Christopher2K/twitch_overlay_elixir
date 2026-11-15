defmodule TwitchOverlaysWeb.AdminControllerTest do
  use TwitchOverlaysWeb.ConnCase

  alias TwitchOverlays.Configuration.Store

  defp signed_in_conn(conn), do: init_test_session(conn, %{user_id: 1})

  describe "GET /admin" do
    test "renders the stored settings", %{conn: conn} do
      assert {:ok, _} = Store.put(:global, %{"title" => "Live"})
      assert {:ok, _} = Store.put(:guests, %{"members" => [%{"name" => "Ana"}]})
      assert {:ok, _} = Store.put(:lastfm, %{"api_key" => "key", "username" => "listener"})

      conn = conn |> signed_in_conn() |> get(~p"/admin")

      assert %{"metadata" => metadata} = inertia_props(conn)

      assert %{"name" => "global", "data" => %{"title" => "Live"}} =
               Enum.find(metadata, &(&1["name"] == "global"))

      assert %{"name" => "guests"} = Enum.find(metadata, &(&1["name"] == "guests"))

      assert %{"name" => "lastfm", "data" => %{"username" => "listener"}} =
               Enum.find(metadata, &(&1["name"] == "lastfm"))
    end

    test "redirects to the login page when signed out", %{conn: conn} do
      conn = get(conn, ~p"/admin")

      assert redirected_to(conn) == ~p"/admin/login"
    end
  end

  describe "POST /admin" do
    test "saves the global settings", %{conn: conn} do
      conn =
        conn
        |> signed_in_conn()
        |> post(~p"/admin", %{
          "global" => %{"banner" => "live", "title" => "Live coding", "focusMode" => true}
        })

      assert redirected_to(conn) == ~p"/admin"
      assert Phoenix.Flash.get(conn.assigns.flash, :success) == "Global information updated"

      assert %{data: %{"title" => "Live coding", "focusMode" => true}} = Store.get(:global)
    end

    test "saves the guests settings", %{conn: conn} do
      conn =
        conn
        |> signed_in_conn()
        |> post(~p"/admin", %{"guests" => %{"members" => [%{"name" => "Ana"}]}})

      assert redirected_to(conn) == ~p"/admin"
      assert Phoenix.Flash.get(conn.assigns.flash, :success) == "Guests information updated"

      assert %{data: %{"members" => [%{"name" => "Ana"}]}} = Store.get(:guests)
    end

    test "saves the Last.fm settings", %{conn: conn} do
      conn =
        conn
        |> signed_in_conn()
        |> post(~p"/admin", %{
          "lastfm" => %{"api_key" => "api-key", "username" => "listener"}
        })

      assert redirected_to(conn) == ~p"/admin"
      assert Phoenix.Flash.get(conn.assigns.flash, :success) == "Last.fm information updated"

      assert %{data: %{"api_key" => "api-key", "username" => "listener"}} =
               Store.get(:lastfm)
    end

    test "keeps a single row per setting when saved twice", %{conn: conn} do
      conn = signed_in_conn(conn)

      for title <- ["first", "second"] do
        post(conn, ~p"/admin", %{"global" => %{"banner" => "live", "title" => title}})
      end

      assert [%{name: "global", data: %{"title" => "second"}}] = Store.all()
    end
  end
end
