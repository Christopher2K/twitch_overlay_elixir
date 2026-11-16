defmodule TwitchOverlaysWeb.Plugs.RawBodyTest do
  use ExUnit.Case, async: true

  alias TwitchOverlaysWeb.Plugs.RawBody

  test "keeps the body for later reads instead of consuming the connection" do
    conn = Plug.Test.conn(:post, "/", ~s({"hello":"world"}))

    assert {:ok, first, conn} = RawBody.read_body(conn, [])
    assert first == ~s({"hello":"world"})
    assert conn.private[:raw_body] == first

    # Plug.Parsers reads through this same reader, so a second read has to
    # return the body again rather than an empty string.
    assert {:ok, ^first, _conn} = RawBody.read_body(conn, [])
  end
end
