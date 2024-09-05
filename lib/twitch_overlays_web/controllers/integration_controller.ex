defmodule TwitchOverlaysWeb.IntegrationController do
  require Logger

  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Integration.Services, as: IntegrationServices

  def index(conn, _) do
    {:ok, integrations} = IntegrationServices.GetAllIntegrations.call()

    conn
    |> assign_prop(
      :integrations,
      integrations |> Enum.map(fn integration -> integration.name end)
    )
    |> render_inertia("admin/integrations")
  end

  def twitch_redirect(conn, _) do
    {:ok, data} = IntegrationServices.SetupIntegrationLogin.call(conn, "twitch")

    data[:conn]
    |> redirect(external: data[:external_url])
  end

  def twitch_callback(conn, %{"code" => code, "state" => state}) do
    with {:ok, conn} <- IntegrationServices.CheckOauthState.call(conn, "twitch", state),
         {:ok, tokens} <-
           IntegrationServices.ExchangeAuthorizationCode.call("twitch", code),
         {:ok, _} <- IntegrationServices.UpsertIntegrationToken.call("twitch", tokens) do
      conn
      |> put_flash(:success, "Connected to Twitch")
      |> redirect(to: ~p"/admin/integrations")
    else
      {:error, error} ->
        Logger.error("Error #{inspect(error)}")

        conn
        |> put_flash(:error, "Login to Twitch failed")
        |> redirect(to: ~p"/admin/integrations")
    end
  end

  def twitch_callback(conn, %{"error" => _, "error_description" => error_description}) do
    Logger.error("Twitch Oauth Error: #{error_description}")

    conn
    |> put_flash(:error, "Login to Twitch failed")
    |> redirect(to: ~p"/admin/integrations")
  end
end
