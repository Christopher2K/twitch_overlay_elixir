defmodule TwitchOverlays.Integration.Subscription do
  @derive {Jason.Encoder, only: [:id, :sub_id, :type, :platform]}

  use Ecto.Schema
  import Ecto.Changeset

  schema "subscriptions" do
    field :sub_id, :string
    field :type, :string
    field :platform, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(subscription, attrs) do
    subscription
    |> cast(attrs, [:sub_id, :type, :platform])
    |> validate_required([:sub_id, :type, :platform])
  end
end
