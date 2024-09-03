defmodule TwitchOverlays.Configuration.Services.GetAllMetadata do
  alias TwitchOverlays.Configuration.MetadataRepo

  def call, do: MetadataRepo.list_medatada()
end
