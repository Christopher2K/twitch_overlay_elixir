defmodule TwitchOverlays.ConfigurationFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TwitchOverlays.Configuration` context.
  """

  @doc """
  Generate a metadata.
  """
  def metadata_fixture(attrs \\ %{}) do
    {:ok, metadata} =
      attrs
      |> Enum.into(%{
        data: %{},
        name: "some name"
      })
      |> TwitchOverlays.Configuration.create_metadata()

    metadata
  end
end
