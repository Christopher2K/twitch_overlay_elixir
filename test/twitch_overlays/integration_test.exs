defmodule TwitchOverlays.IntegrationTest do
  use TwitchOverlays.DataCase

  alias TwitchOverlays.Integration

  describe "platforms" do
    alias TwitchOverlays.Integration.Platform

    import TwitchOverlays.IntegrationFixtures

    @invalid_attrs %{name: nil, access_token: nil, refresh_token: nil}

    test "list_platforms/0 returns all platforms" do
      platform = platform_fixture()
      assert Integration.list_platforms() == [platform]
    end

    test "get_platform!/1 returns the platform with given id" do
      platform = platform_fixture()
      assert Integration.get_platform!(platform.id) == platform
    end

    test "create_platform/1 with valid data creates a platform" do
      valid_attrs = %{name: "some name", access_token: "some access_token", refresh_token: "some refresh_token"}

      assert {:ok, %Platform{} = platform} = Integration.create_platform(valid_attrs)
      assert platform.name == "some name"
      assert platform.access_token == "some access_token"
      assert platform.refresh_token == "some refresh_token"
    end

    test "create_platform/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Integration.create_platform(@invalid_attrs)
    end

    test "update_platform/2 with valid data updates the platform" do
      platform = platform_fixture()
      update_attrs = %{name: "some updated name", access_token: "some updated access_token", refresh_token: "some updated refresh_token"}

      assert {:ok, %Platform{} = platform} = Integration.update_platform(platform, update_attrs)
      assert platform.name == "some updated name"
      assert platform.access_token == "some updated access_token"
      assert platform.refresh_token == "some updated refresh_token"
    end

    test "update_platform/2 with invalid data returns error changeset" do
      platform = platform_fixture()
      assert {:error, %Ecto.Changeset{}} = Integration.update_platform(platform, @invalid_attrs)
      assert platform == Integration.get_platform!(platform.id)
    end

    test "delete_platform/1 deletes the platform" do
      platform = platform_fixture()
      assert {:ok, %Platform{}} = Integration.delete_platform(platform)
      assert_raise Ecto.NoResultsError, fn -> Integration.get_platform!(platform.id) end
    end

    test "change_platform/1 returns a platform changeset" do
      platform = platform_fixture()
      assert %Ecto.Changeset{} = Integration.change_platform(platform)
    end
  end
end
