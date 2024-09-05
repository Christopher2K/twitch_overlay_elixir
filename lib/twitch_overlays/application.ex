defmodule TwitchOverlays.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TwitchOverlaysWeb.Telemetry,
      TwitchOverlays.Repo,
      {Ecto.Migrator,
       repos: Application.fetch_env!(:twitch_overlays, :ecto_repos), skip: skip_migrations?()},
      {DNSCluster, query: Application.get_env(:twitch_overlays, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: TwitchOverlays.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: TwitchOverlays.Finch},
      # Start a worker by calling: TwitchOverlays.Worker.start_link(arg)
      # {TwitchOverlays.Worker, arg},
      # Inertia SSR
      {Inertia.SSR, path: Path.join([Application.app_dir(:twitch_overlays), "priv"])},
      # Start to serve requests, typically the last entry
      TwitchOverlaysWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TwitchOverlays.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TwitchOverlaysWeb.Endpoint.config_change(changed, removed)
    :ok
  end

  defp skip_migrations?() do
    # By default, sqlite migrations are run when using a release
    System.get_env("RELEASE_NAME") != nil
  end
end
