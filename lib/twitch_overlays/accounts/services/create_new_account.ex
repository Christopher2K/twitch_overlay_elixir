defmodule TwitchOverlays.Accounts.Services.CreateNewAccount do
  require Logger

  alias TwitchOverlays.Accounts.UserRepo

  def call(username, password) do
    hashed_password = Argon2.hash_pwd_salt(password)
    UserRepo.create_user(%{username: username, password: hashed_password})
  end
end
