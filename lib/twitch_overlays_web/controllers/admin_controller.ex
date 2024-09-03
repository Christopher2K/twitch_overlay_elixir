defmodule TwitchOverlaysWeb.AdminController do
  require Logger
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Accounts.Services, as: AccountsServices
  alias TwitchOverlays.Configuration.Services, as: MetadataServices

  def index(conn, _) do
    with {:ok, metadata} <- MetadataServices.GetAllMetadata.call() do
      conn
      |> assign_prop(:metadata, metadata)
      |> render_inertia("admin/index")
    end
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

  def configuration_submission(conn, %{"global" => global_data}) do
    case MetadataServices.UpdateMetadata.call("global", global_data) do
      {:ok, _} ->
        conn
        |> put_flash(:success, "Global information updated")
        |> redirect(to: ~p"/admin")

      {:error, reason} when is_binary(reason) ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: ~p"/admin")

      {:error, reason} ->
        Logger.error("GET /admin/login failed with reason: #{inspect(reason)}")

        conn
        |> put_flash(:error, "Something went wrong")
        |> redirect(to: ~p"/admin")
    end
  end
end
