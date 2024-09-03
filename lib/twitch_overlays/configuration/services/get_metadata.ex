defmodule TwitchOverlays.Configuration.Services.GetMetadata do
  alias TwitchOverlays.Configuration.MetadataRepo

  def call(name) do
    with {:ok, metadata} <- MetadataRepo.get_metadata_by_name(name) do
      {:ok, metadata}
    else
      _ -> {:error, "No metadata #{name} not found"}
    end
  end
end
