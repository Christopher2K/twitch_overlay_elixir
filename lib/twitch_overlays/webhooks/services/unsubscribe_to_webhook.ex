defmodule TwitchOverlays.Webhooks.Services.UnsubscribeToWebhook do
  require Logger

  alias TwitchOverlays.Integration.Workers.TwitchAppTokenWorker
  alias TwitchOverlays.Integration.SubscriptionRepo

  @twitch_endpoint "https://api.twitch.tv/helix/eventsub/subscriptions"
  def call(subscription_id) do
    Logger.debug("Unsuscribe to event #{subscription_id}")

    with {:ok, subscription} <- SubscriptionRepo.get_by_id(subscription_id) do
      twitch_config = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch]
      client_id = twitch_config[:client_id]
      app_token = TwitchAppTokenWorker.get_token()

      Req.delete(@twitch_endpoint <> "?id=" <> subscription.sub_id,
        auth: {:bearer, app_token},
        headers: %{"client-id" => client_id}
      )
      |> case do
        {:ok, %Req.Response{status: 204}} ->
          SubscriptionRepo.delete(subscription_id)
          {:ok, nil}

        {status, response} ->
          Logger.error("Unexpected error #{inspect(status)}, #{inspect(response)}")
          {:error, :bad_gateway}
      end
    else
      error -> error
    end
  end
end
