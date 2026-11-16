defmodule TwitchOverlays.Release do
  @moduledoc """
  Used for executing DB release tasks when run in production without Mix
  installed.
  """

  alias TwitchOverlays.Accounts.UserRepo
  alias TwitchOverlays.Accounts.Services.CreateNewAccount

  @app :twitch_overlays

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  defp load_app do
    Application.load(@app)
  end

  def create_admin do
    load_app()

    {:ok, _, _} =
      Ecto.Migrator.with_repo(TwitchOverlays.Repo, fn _ ->
        args = System.argv()

        is_auto? = Enum.member?(args, "--auto-create")

        username =
          if is_auto?,
            do: System.get_env("ADMIN_USERNAME"),
            else: IO.gets("Username: ") |> String.trim()

        password =
          if is_auto?,
            do: System.get_env("ADMIN_PASSWORD"),
            else: IO.gets("Password: ") |> String.trim()

        if username == nil || String.length(username) == 0 || password == nil ||
             String.length(password) == 0 do
          IO.puts("[error] Missing username or password")
          System.halt(1)
        end

        IO.puts("Checking if #{username} already exists...")

        case UserRepo.get_by_username(username) do
          {:error, :not_found} ->
            IO.puts("Admin not found, creating #{username}...")

            with {:ok, _} <- CreateNewAccount.call(username, password) do
              IO.puts("Admin created!")
              System.halt(0)
            else
              {:error, reason} ->
                IO.puts("[error] Failed to create admin: #{inspect(reason)}")
                System.halt(1)
            end

          {:ok, _} ->
            IO.puts("Admin #{username} was already created!")
            System.halt(0)
        end
      end)
  end
end
