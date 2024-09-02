defmodule TwitchOverlays.Accounts.Services.LoginUser do
  require Logger

  alias TwitchOverlays.Accounts.UserRepo

  def call(username, password) do
    with {:ok, user} <- UserRepo.get_by_username(username),
         true <- Argon2.verify_pass(password, user.password) do
      {:ok, user.id}
    else
      _ ->
        {:error, "Username or password is incorrect"}
    end
  end
end
