defmodule TwitchOverlays.Configuration.StoreTest do
  use TwitchOverlays.DataCase

  alias TwitchOverlays.Configuration.Store

  describe "get/1" do
    test "returns nil when the setting was never saved" do
      assert Store.get(:global) == nil
    end

    test "accepts the setting name as an atom or a string" do
      assert {:ok, _} = Store.put("global", %{"title" => "Live"})

      assert %{name: "global", data: %{"title" => "Live"}} = Store.get(:global)
      assert %{name: "global"} = Store.get("global")
    end

    test "returns settings independently" do
      assert {:ok, _} = Store.put(:global, %{"title" => "Live"})
      assert {:ok, _} = Store.put(:guests, %{"members" => []})

      assert Store.get(:global).data == %{"title" => "Live"}
      assert Store.get(:guests).data == %{"members" => []}
    end
  end

  describe "put/2" do
    test "stores a new setting" do
      assert {:ok, %{name: "global", data: %{"title" => "Live"}}} =
               Store.put(:global, %{"title" => "Live"})

      assert [%{name: "global"}] = Store.all()
    end

    test "replaces an existing setting instead of inserting a second row" do
      assert {:ok, _} = Store.put(:global, %{"title" => "first"})
      assert {:ok, updated} = Store.put(:global, %{"title" => "second"})

      assert updated.data == %{"title" => "second"}
      assert [%{name: "global"}] = Store.all()
    end

    test "broadcasts the saved setting on the overlay room" do
      TwitchOverlaysWeb.Endpoint.subscribe("overlay_room:lobby")

      assert {:ok, metadata} = Store.put(:guests, %{"members" => [%{"name" => "Ana"}]})

      assert_receive %Phoenix.Socket.Broadcast{
        topic: "overlay_room:lobby",
        event: "update_metadata",
        payload: payload
      }

      assert payload.id == metadata.id
      assert payload.name == "guests"
      assert payload.data == %{"members" => [%{"name" => "Ana"}]}
    end

    test "does not broadcast when the setting is invalid" do
      TwitchOverlaysWeb.Endpoint.subscribe("overlay_room:lobby")

      assert {:error, %Ecto.Changeset{}} = Store.put(nil, %{})
      refute_receive %Phoenix.Socket.Broadcast{event: "update_metadata"}
    end
  end
end
