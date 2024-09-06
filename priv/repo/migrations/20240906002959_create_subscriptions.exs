defmodule TwitchOverlays.Repo.Migrations.CreateSubscriptions do
  use Ecto.Migration

  def change do
    create table(:subscriptions) do
      add :sub_id, :string
      add :type, :string
      add :platform, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index(:subscriptions, [:type])
    create unique_index(:subscriptions, [:sub_id])
  end
end
