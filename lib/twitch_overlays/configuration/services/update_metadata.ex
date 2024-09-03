defmodule TwitchOverlays.Configuration.Services.UpdateMetadata do
  alias TwitchOverlays.Configuration.MetadataRepo

  def call(name, data) do
    result =
      case MetadataRepo.get_metadata_by_name(name) do
        {:error, :not_found} ->
          MetadataRepo.create_metadata(%{name: name, data: data})

        {:ok, metadata} ->
          metadata
          |> MetadataRepo.update_metadata(%{data: data})
      end

    with {:ok, data} <- result do
      TwitchOverlaysWeb.Endpoint.broadcast("overlay_room:lobby", "update_metadata", data)
      result
    else
      error -> error
    end
  end
end
