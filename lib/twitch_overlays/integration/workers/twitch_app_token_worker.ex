defmodule TwitchOverlays.Integration.Workers.TwitchAppTokenWorker do
  require Logger

  use GenServer

  alias TwitchOverlays.Integration.Services.GetTwitchAppToken

  def start_link(_) do
    GenServer.start_link(__MODULE__, %{}, name: __MODULE__)
  end

  @impl true
  def init(_) do
    with {:ok, app_token} <- GetTwitchAppToken.call() do
      Logger.debug("Intialized the TwitchAppTokenWorker...")
      Process.send_after(self(), :renew, floor(app_token["expires_in"] * 1000 / 2))
      {:ok, %{app_token: app_token["access_token"], expires_in: app_token["expires_in"]}}
    end
  end

  @impl true
  def handle_call(:get, _from, state), do: {:reply, state.app_token, state}

  @impl true
  def handle_call(:renew, _from, _state) do
    with {:ok, app_token} <- GetTwitchAppToken.call() do
      Process.send_after(self(), :renew, floor(app_token["expires_in"] * 1000 / 2))

      {:reply, app_token["access_token"],
       %{app_token: app_token["access_token"], expires_in: app_token["expires_in"]}}
    end
  end

  # Public API
  def get_token(), do: GenServer.call(__MODULE__, :get)
  def renew(), do: GenServer.call(__MODULE__, :renew)
end
