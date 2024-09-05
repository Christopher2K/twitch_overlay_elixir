defmodule TwitchOverlaysWeb.WebhookController do
  require Logger

  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Webhooks.Services, as: WebhooksServices

  def twitch_event(conn, _) do
    Logger.debug("Twitch webhook endpoint called")

    with {:ok, conn} <- WebhooksServices.CheckTwitchWebhooksSecret.call(conn) do
      Logger.debug("Twitch webhook event signature verified")

      WebhooksServices.HandleWebhookEvent.call("twitch", conn)
    else
      _ ->
        Logger.error("Twitch webhook event signature invalid")
        conn |> send_resp(400, "")
    end
  end
end
