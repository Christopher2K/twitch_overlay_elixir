defmodule TwitchOverlays.Configuration.Services.UpdateMetadata do
  alias TwitchOverlays.Configuration.MetadataRepo

  def call(name, data) do
    case MetadataRepo.get_metadata_by_name(name) do
      {:error, :not_found} ->
        MetadataRepo.create_metadata(%{name: name, data: data})

      {:ok, metadata} ->
        metadata
        |> MetadataRepo.update_metadata(data)
    end
  end
end
