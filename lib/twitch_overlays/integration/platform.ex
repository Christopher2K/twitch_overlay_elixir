defmodule TwitchOverlays.Integration.Platform do
  @derive {Jason.Encoder, only: [:name]}

  use Ecto.Schema
  import Ecto.Changeset

  schema "platforms" do
    field :name, :string
    field :access_token, :string
    field :refresh_token, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(platform, attrs) do
    platform
    |> cast(attrs, [:name, :access_token, :refresh_token])
    |> validate_required([:name, :access_token, :refresh_token])
  end
end
