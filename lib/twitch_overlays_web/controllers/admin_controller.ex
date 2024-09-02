defmodule TwitchOverlaysWeb.AdminController do
  require Logger
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Accounts.Services

  def index(conn, _),
    do:
      conn
      |> render_inertia("admin/index")

  def login(conn, _),
    do:
      conn
      |> render_inertia("admin/login")

  def login_submission(conn, %{"username" => username, "password" => password}) do
    case Services.LoginUser.call(username, password) do
      {:ok, user_id} ->
        conn
        |> put_session(:user_id, user_id)
        |> redirect(to: ~p"/admin")

      {:error, reason} when is_binary(reason) ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: ~p"/admin/login")

      {:error, reason} ->
        Logger.error("GET /admin/login failed with reason: #{inspect(reason)}")

        conn
        |> put_flash(:error, "Something went wrong")
        |> redirect(to: ~p"/admin/login")
    end
  end

  def logout(conn, _),
    do:
      conn
      |> delete_session(:user_id)
      |> redirect(to: ~p"/admin/login")
end
