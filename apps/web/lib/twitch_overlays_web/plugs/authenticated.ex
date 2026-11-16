defmodule TwitchOverlaysWeb.Plugs.Authenticated do
  import Plug.Conn
  use TwitchOverlaysWeb, :controller

  def init(opts), do: opts

  def call(conn, _opts) do
    case get_session(conn, :user_id) do
      nil ->
        conn
        |> put_flash(:error, "You must be logged in to access this page.")
        |> redirect(to: ~p"/admin/login")
        |> halt()

      user_id ->
        assign(conn, :user_id, user_id)
    end
  end
end
