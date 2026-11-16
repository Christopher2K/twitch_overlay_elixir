defmodule TwitchOverlays.IntegrationFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `TwitchOverlays.Integration` context.
  """

  @doc """
  Generate a platform.
  """
  def platform_fixture(attrs \\ %{}) do
    {:ok, platform} =
      attrs
      |> Enum.into(%{
        access_token: "some access_token",
        name: "some name",
        refresh_token: "some refresh_token"
      })
      |> TwitchOverlays.Integration.create_platform()

    platform
  end
end
