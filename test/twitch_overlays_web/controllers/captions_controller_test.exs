defmodule TwitchOverlaysWeb.CaptionsControllerTest do
  use TwitchOverlaysWeb.ConnCase

  setup do
    original = Application.get_env(:twitch_overlays, :soniox)
    Application.put_env(:twitch_overlays, :soniox, api_key: nil)

    on_exit(fn ->
      if original do
        Application.put_env(:twitch_overlays, :soniox, original)
      else
        Application.delete_env(:twitch_overlays, :soniox)
      end
    end)
  end

  defp signed_in_conn(conn), do: init_test_session(conn, %{user_id: 1})

  test "renders the admin controls and their configuration state", %{conn: conn} do
    conn = conn |> signed_in_conn() |> get(~p"/admin/captions")

    assert html_response(conn, 200)
    assert %{"sonioxConfigured" => false} = inertia_props(conn)
  end

  test "requires authentication for the controls and caption endpoints", %{conn: conn} do
    assert conn |> get(~p"/admin/captions") |> redirected_to() == ~p"/admin/login"

    assert conn
           |> post(~p"/admin/captions/temporary-key")
           |> redirected_to() == ~p"/admin/login"

    assert conn
           |> post(~p"/admin/captions/publish", %{action: "clear"})
           |> redirected_to() == ~p"/admin/login"
  end

  test "returns service unavailable when Soniox is not configured", %{conn: conn} do
    conn = conn |> signed_in_conn() |> post(~p"/admin/captions/temporary-key")

    assert json_response(conn, 503) == %{"error" => "Soniox is not configured"}
  end

  test "broadcasts a bounded caption window", %{conn: conn} do
    TwitchOverlaysWeb.Endpoint.subscribe("overlay_room:lobby")

    conn =
      conn
      |> signed_in_conn()
      |> post(~p"/admin/captions/publish", %{
        partial: "and this is live",
        finalized: ["First sentence.", "Second sentence."]
      })

    assert json_response(conn, 200) == %{"ok" => true}

    assert_receive %Phoenix.Socket.Broadcast{
      topic: "overlay_room:lobby",
      event: "captions",
      payload: %{
        partial: "and this is live",
        finalized: ["First sentence.", "Second sentence."]
      }
    }
  end

  test "broadcasts a clear event", %{conn: conn} do
    TwitchOverlaysWeb.Endpoint.subscribe("overlay_room:lobby")

    conn =
      conn
      |> signed_in_conn()
      |> post(~p"/admin/captions/publish", %{action: "clear"})

    assert json_response(conn, 200) == %{"ok" => true}

    assert_receive %Phoenix.Socket.Broadcast{
      topic: "overlay_room:lobby",
      event: "captions_clear",
      payload: %{}
    }
  end

  test "rejects invalid or oversized caption payloads", %{conn: conn} do
    conn = signed_in_conn(conn)

    for payload <- [
          %{partial: String.duplicate("a", 501), finalized: []},
          %{partial: "ok", finalized: ["one", "two", "three"]},
          %{partial: "ok", finalized: ["ok", 123]},
          %{partial: nil, finalized: []}
        ] do
      response = post(conn, ~p"/admin/captions/publish", payload)
      assert json_response(response, 422) == %{"error" => "Invalid caption payload"}
    end
  end
end
