defmodule TwitchOverlays.Integration.Services.CheckOauthState do
  def call(conn, "twitch", state) do
    session_state = conn |> Plug.Conn.get_session(:twitch_oauth_state)

    updated_conn = conn |> Plug.Conn.delete_session(:twitch_oauth_state)

    if state === session_state do
      {:ok, updated_conn}
    else
      {:error, updated_conn}
    end
  end
end
