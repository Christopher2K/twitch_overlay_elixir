defmodule TwitchOverlays.Accounts.UserRepo do
  import Ecto.Query, warn: false
  alias TwitchOverlays.Repo

  alias TwitchOverlays.Accounts.User

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert(returning: true)
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def get_by_username(username) do
    User
    |> Repo.get_by(username: username)
    |> case do
      nil -> {:error, :not_found}
      user -> {:ok, user}
    end
  end
end
