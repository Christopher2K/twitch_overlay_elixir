defmodule TwitchOverlays.Webhooks.Services.CheckTwitchWebhooksSecret do
  import Plug.Conn

  def call(conn) do
    secret = Application.fetch_env!(:twitch_overlays, :integrations)[:twitch][:webhook_secret]

    [message_id] = conn |> get_req_header("twitch-eventsub-message-id")
    [timestamp] = conn |> get_req_header("twitch-eventsub-message-timestamp")
    raw_body = conn.private[:raw_body]

    generated_hmac =
      "sha256=" <>
        (:crypto.mac(:hmac, :sha256, secret, message_id <> timestamp <> raw_body)
         |> Base.encode16(case: :lower))

    [signature] = conn |> get_req_header("twitch-eventsub-message-signature")

    signature_valid? =
      byte_size(generated_hmac) == byte_size(signature) and
        :crypto.hash_equals(generated_hmac, signature)

    if signature_valid? do
      {:ok, conn}
    else
      {:error, conn}
    end
  end
end
