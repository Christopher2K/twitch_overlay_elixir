defmodule TwitchOverlaysWeb.IntegrationController do
  require Logger

  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Integration.Services, as: IntegrationServices
  alias TwitchOverlays.Webhooks.Services, as: WebhookServices
  alias TwitchOverlays.Webhooks.Meta

  def index(conn, _) do
    {:ok, integrations} = IntegrationServices.GetAllIntegrations.call()
    {:ok, subscriptions} = IntegrationServices.GetAllSubscriptions.call()

    conn
    |> assign_prop(
      :integrations,
      integrations |> Enum.map(fn integration -> integration.name end)
    )
    |> assign_prop(
      :subscriptions,
      subscriptions
    )
    |> assign_prop(
      :twitch_sub_types,
      Meta.get_available_subscriptions_type("twitch")
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

  def subscribe_to_event(conn, %{"platform" => platform, "type" => type}) do
    with {:ok, _sub} <- WebhookServices.SubscribeToWebhook.call(platform, type) do
      conn
      |> put_flash(:success, "Subscribed to #{type}")
      |> redirect(to: ~p"/admin/integrations")
    else
      error ->
        Logger.error(inspect(error))

        conn
        |> put_flash(:error, "Failed to subscribe to #{type}")
        |> redirect(to: ~p"/admin/integrations")
    end
  end

  def unsubscribe_to_event(conn, %{"id" => id}) do
    with {:ok, _} <- WebhookServices.UnsubscribeToWebhook.call(id) do
      conn
      |> put_flash(:success, "Unsubcribed to the event")
      |> redirect(to: ~p"/admin/integrations")
    else
      error ->
        Logger.error(inspect(error))

        conn
        |> put_flash(:error, "Failed to unsubscribe")
        |> redirect(to: ~p"/admin/integrations")
    end
  end
end
