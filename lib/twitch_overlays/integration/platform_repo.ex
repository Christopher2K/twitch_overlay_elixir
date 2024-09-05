defmodule TwitchOverlays.Integration.PlatformRepo do
  @moduledoc """
  The Integration context.
  """
  import Ecto.Query, warn: false

  alias TwitchOverlays.Repo

  alias TwitchOverlays.Integration.Platform

  def list, do: {:ok, Repo.all(Platform)}

  def get_by_name(name) do
    Repo.one(
      from p in Platform,
        where: [name: ^name]
    )
    |> case do
      nil -> {:error, :not_found}
      value -> {:ok, value}
    end
  end

  def create(attrs \\ %{}) do
    %Platform{}
    |> Platform.changeset(attrs)
    |> Repo.insert(returning: true)
  end

  def update(%Platform{} = platform, attrs) do
    platform
    |> Platform.changeset(attrs)
    |> Repo.update(returning: true)
  end
end
