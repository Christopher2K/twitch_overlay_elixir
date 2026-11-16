defmodule TwitchOverlays.Integration.Services.UpsertIntegrationToken do
  alias TwitchOverlays.Integration.PlatformRepo

  def call("twitch", args) do
    case PlatformRepo.get_by_name("twitch") |> dbg do
      {:ok, platform} ->
        platform |> PlatformRepo.update(args)

      {:error, :not_found} ->
        PlatformRepo.create(args |> Map.put("name", "twitch"))
    end
  end
end
