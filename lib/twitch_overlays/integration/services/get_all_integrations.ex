defmodule TwitchOverlays.Integration.Services.GetAllIntegrations do
  alias TwitchOverlays.Integration.PlatformRepo

  def call(), do: PlatformRepo.list()
end
