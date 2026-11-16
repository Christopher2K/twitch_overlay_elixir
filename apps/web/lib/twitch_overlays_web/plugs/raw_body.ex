defmodule TwitchOverlaysWeb.Plugs.RawBody do
  @moduledoc """
  Body reader for `Plug.Parsers` that reads the request body exactly once and
  keeps the bytes in `conn.private[:raw_body]`.

  Twitch signs the webhook payload, so the raw bytes are needed after parsing.
  Reading them with a separate plug before `Plug.Parsers` looked harmless but
  isn't: `Plug.Conn.read_body/2` returns an updated connection that carries the
  read position, and dropping it makes `Plug.Parsers` read the body a second
  time. That only works when the client sent the body in the same packet as the
  headers, because the bytes are still buffered. Clients that wait for a
  `100 Continue` interim response (Safari does this) send the body only after
  the first read, so the second read blocks until it times out and the request
  fails with a 408 read timeout.
  """

  @spec read_body(Plug.Conn.t(), Keyword.t()) ::
          {:ok, binary, Plug.Conn.t()}
          | {:more, binary, Plug.Conn.t()}
          | {:error, term}
  def read_body(conn, opts) do
    case conn.private[:raw_body] do
      nil ->
        case Plug.Conn.read_body(conn, opts) do
          {:ok, body, conn} -> {:ok, body, put_raw_body(conn, body)}
          {:more, body, conn} -> {:more, body, conn}
          {:error, _reason} = error -> error
        end

      body ->
        {:ok, body, conn}
    end
  end

  defp put_raw_body(conn, body), do: Plug.Conn.put_private(conn, :raw_body, body)
end
