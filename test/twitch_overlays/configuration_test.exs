defmodule TwitchOverlays.ConfigurationTest do
  use TwitchOverlays.DataCase

  alias TwitchOverlays.Configuration

  describe "medatada" do
    alias TwitchOverlays.Configuration.Metadata

    import TwitchOverlays.ConfigurationFixtures

    @invalid_attrs %{data: nil, name: nil}

    test "list_medatada/0 returns all medatada" do
      metadata = metadata_fixture()
      assert Configuration.list_medatada() == [metadata]
    end

    test "get_metadata!/1 returns the metadata with given id" do
      metadata = metadata_fixture()
      assert Configuration.get_metadata!(metadata.id) == metadata
    end

    test "create_metadata/1 with valid data creates a metadata" do
      valid_attrs = %{data: %{}, name: "some name"}

      assert {:ok, %Metadata{} = metadata} = Configuration.create_metadata(valid_attrs)
      assert metadata.data == %{}
      assert metadata.name == "some name"
    end

    test "create_metadata/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Configuration.create_metadata(@invalid_attrs)
    end

    test "update_metadata/2 with valid data updates the metadata" do
      metadata = metadata_fixture()
      update_attrs = %{data: %{}, name: "some updated name"}

      assert {:ok, %Metadata{} = metadata} = Configuration.update_metadata(metadata, update_attrs)
      assert metadata.data == %{}
      assert metadata.name == "some updated name"
    end

    test "update_metadata/2 with invalid data returns error changeset" do
      metadata = metadata_fixture()
      assert {:error, %Ecto.Changeset{}} = Configuration.update_metadata(metadata, @invalid_attrs)
      assert metadata == Configuration.get_metadata!(metadata.id)
    end

    test "delete_metadata/1 deletes the metadata" do
      metadata = metadata_fixture()
      assert {:ok, %Metadata{}} = Configuration.delete_metadata(metadata)
      assert_raise Ecto.NoResultsError, fn -> Configuration.get_metadata!(metadata.id) end
    end

    test "change_metadata/1 returns a metadata changeset" do
      metadata = metadata_fixture()
      assert %Ecto.Changeset{} = Configuration.change_metadata(metadata)
    end
  end
end
