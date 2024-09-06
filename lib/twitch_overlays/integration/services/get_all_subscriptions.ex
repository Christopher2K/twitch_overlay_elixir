defmodule TwitchOverlays.Integration.Services.GetAllSubscriptions do
  alias TwitchOverlays.Integration.SubscriptionRepo

  def call(), do: SubscriptionRepo.list()
end
