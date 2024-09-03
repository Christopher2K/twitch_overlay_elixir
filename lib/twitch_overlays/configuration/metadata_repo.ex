defmodule TwitchOverlays.Configuration.MetadataRepo do
  import Ecto.Query, warn: false

  alias TwitchOverlays.Repo

  alias TwitchOverlays.Configuration.Metadata

  def list_medatada, do: {:ok, Repo.all(Metadata)}

  def get_metadata_by_name(name) do
    case Repo.get_by(Metadata, name: name) do
      nil -> {:error, :not_found}
      metadata -> {:ok, metadata}
    end
  end

  def create_metadata(attrs \\ %{}) do
    %Metadata{}
    |> Metadata.changeset(attrs)
    |> Repo.insert(returning: true)
  end

  def update_metadata(%Metadata{} = metadata, attrs) do
    metadata
    |> Metadata.changeset(attrs)
    |> Repo.update(returning: true)
  end
end
