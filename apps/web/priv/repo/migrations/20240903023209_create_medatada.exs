defmodule TwitchOverlays.Repo.Migrations.CreateMedatada do
  use Ecto.Migration

  def change do
    create table(:metadata) do
      add :name, :string
      add :data, :map

      timestamps(type: :utc_datetime)
    end

    create unique_index(:metadata, [:name])
  end
end
