defmodule TwitchOverlaysWeb.AdminController do
  use TwitchOverlaysWeb, :controller

  def index(conn, _),
    do:
      conn
      |> render_inertia("admin/index")

  def login(conn, _),
    do:
      conn
      |> render_inertia("admin/index")

  def logout(conn, _),
    do:
      conn
      |> render_inertia("admin/index")
end
