defmodule TwitchOverlaysWeb.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build common data structures and query the data layer.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use TwitchOverlaysWeb.ConnCase, async: true`, although
  this option is not recommended for other databases.
  """

  import Phoenix.ConnTest, only: [html_response: 2]

  use ExUnit.CaseTemplate

  using do
    quote do
      # The default endpoint for testing
      @endpoint TwitchOverlaysWeb.Endpoint

      use TwitchOverlaysWeb, :verified_routes

      # Import conveniences for testing with connections
      import Plug.Conn
      import Phoenix.ConnTest
      import TwitchOverlaysWeb.ConnCase
    end
  end

  setup tags do
    TwitchOverlays.DataCase.setup_sandbox(tags)
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end

  @doc """
  Returns the props embedded by Inertia in the page's data script.

  Keys are strings, as they come back from decoding the JSON payload
  (for example `%{"globalData" => %{"name" => "global"}}`).
  """
  def inertia_props(conn) do
    conn
    |> html_response(200)
    |> then(
      &Regex.run(~r/<script data-page="app" type="application\/json">(.*?)<\/script>/s, &1,
        capture: :all_but_first
      )
    )
    |> then(fn [json] -> json |> Jason.decode!() |> Map.fetch!("props") end)
  end
end
