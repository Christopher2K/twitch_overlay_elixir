defmodule TwitchOverlays.Configuration.Store do
  @moduledoc """
  Read/write entry point for the overlay configuration.

  Configuration is stored as one row per setting in the `metadata` table
  (`name` + `data` JSON map). The settings in use are `"global"` (stream
  banner/title/focus mode) and `"guests"` (participant list).

  Reads return the stored `Metadata` struct, which JSON-encodes to
  `%{name: ..., data: ...}`, or `nil` when the setting was never saved.

  Writes upsert and broadcast the new value on `overlay_room:lobby`, so
  callers never publish `"update_metadata"` themselves.
  """

  alias TwitchOverlays.Repo
  alias TwitchOverlays.Configuration.Metadata

  @topic "overlay_room:lobby"
  @event "update_metadata"

  @type name :: String.t() | atom()

  @doc "Returns every stored setting."
  @spec all() :: [Metadata.t()]
  def all, do: Repo.all(Metadata)

  @doc "Returns the setting stored under `name`, or `nil` when absent."
  @spec get(name()) :: Metadata.t() | nil
  def get(name), do: Repo.get_by(Metadata, name: normalize(name))

  @doc """
  Inserts or replaces the setting stored under `name`.

  Replaces in a single upsert statement so concurrent saves (or a first
  save racing the admin page) cannot violate the unique index on `name`.
  """
  @spec put(name(), map()) :: {:ok, Metadata.t()} | {:error, Ecto.Changeset.t()}
  def put(name, data) do
    %Metadata{}
    |> Metadata.changeset(%{name: normalize(name), data: data})
    |> Repo.insert(
      conflict_target: :name,
      on_conflict: {:replace, [:data, :updated_at]},
      returning: true
    )
    |> case do
      {:ok, metadata} = result ->
        TwitchOverlaysWeb.Endpoint.broadcast(@topic, @event, metadata)
        result

      error ->
        error
    end
  end

  defp normalize(nil), do: nil
  defp normalize(name) when is_atom(name), do: Atom.to_string(name)
  defp normalize(name) when is_binary(name), do: name
end
