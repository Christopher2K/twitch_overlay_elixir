defmodule TwitchOverlaysWeb.LastfmControllerTest do
  use TwitchOverlaysWeb.ConnCase

  test "returns an empty payload when Last.fm is not configured", %{conn: conn} do
    conn = get(conn, ~p"/api/lastfm/now-playing")

    assert json_response(conn, 200) == %{"track" => nil}
    assert get_resp_header(conn, "cache-control") == ["public, max-age=10"]
  end
end
