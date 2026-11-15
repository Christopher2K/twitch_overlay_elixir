defmodule TwitchOverlaysWeb.AdminController do
  require Logger
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Accounts.Services, as: AccountsServices
  alias TwitchOverlays.Configuration.Store

  def index(conn, _) do
    conn
    |> assign_prop(:metadata, Store.all())
    |> render_inertia("admin/index")
  end

  def login(conn, _),
    do:
      conn
      |> render_inertia("admin/login")

  def login_submission(conn, %{"username" => username, "password" => password}) do
    case AccountsServices.LoginUser.call(username, password) do
      {:ok, user_id} ->
        conn
        |> put_session(:user_id, user_id)
        |> redirect(to: ~p"/admin")

      {:error, reason} when is_binary(reason) ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: ~p"/admin/login")

      {:error, reason} ->
        Logger.error("POST /admin/login failed with reason: #{inspect(reason)}")

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

  def configuration_submission(conn, %{"global" => data}),
    do: save_setting(conn, "global", data, "Global information updated")

  def configuration_submission(conn, %{"guests" => data}),
    do: save_setting(conn, "guests", data, "Guests information updated")

  def configuration_submission(conn, %{"lastfm" => data}),
    do: save_setting(conn, "lastfm", data, "Last.fm information updated")

  defp save_setting(conn, name, data, success_message) do
    case Store.put(name, data) do
      {:ok, _metadata} ->
        conn
        |> put_flash(:success, success_message)
        |> redirect(to: ~p"/admin")

      {:error, %Ecto.Changeset{} = changeset} ->
        Logger.error("POST /admin could not save #{name}: #{inspect(changeset.errors)}")

        conn
        |> put_flash(:error, "Something went wrong")
        |> redirect(to: ~p"/admin")
    end
  end
end
