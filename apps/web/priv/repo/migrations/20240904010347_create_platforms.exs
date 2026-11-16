defmodule TwitchOverlays.Repo.Migrations.CreatePlatforms do
  use Ecto.Migration

  def change do
    create table(:platforms) do
      add :name, :string
      add :access_token, :string
      add :refresh_token, :string

      timestamps(type: :utc_datetime)
    end

    create unique_index(:platforms, [:name])
  end
end
