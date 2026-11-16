defmodule TwitchOverlays.Configuration.Metadata do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:name, :data]}

  schema "metadata" do
    field :name, :string
    field :data, :map

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(metadata, attrs) do
    metadata
    |> cast(attrs, [:name, :data])
    |> validate_required([:name])
  end
end
