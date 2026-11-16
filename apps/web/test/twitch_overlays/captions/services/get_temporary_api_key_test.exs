defmodule TwitchOverlays.Captions.Services.GetTemporaryApiKeyTest do
  use ExUnit.Case, async: false

  alias TwitchOverlays.Captions.Services.GetTemporaryApiKey

  setup do
    original = Application.get_env(:twitch_overlays, :soniox)

    on_exit(fn ->
      if original do
        Application.put_env(:twitch_overlays, :soniox, original)
      else
        Application.delete_env(:twitch_overlays, :soniox)
      end
    end)
  end

  test "returns not configured without a Soniox key" do
    Application.put_env(:twitch_overlays, :soniox, api_key: nil)

    refute GetTemporaryApiKey.configured?()
    assert {:error, :not_configured} = GetTemporaryApiKey.call()
  end

  test "exchanges the permanent key for a temporary transcription key" do
    Application.put_env(:twitch_overlays, :soniox, api_key: "permanent-key")

    Req.Test.stub(__MODULE__, fn conn ->
      assert conn.request_path == "/v1/auth/temporary-api-key"
      assert Plug.Conn.get_req_header(conn, "authorization") == ["Bearer permanent-key"]

      {:ok, body, conn} = Plug.Conn.read_body(conn)

      assert Jason.decode!(body) == %{
               "usage_type" => "transcribe_websocket",
               "expires_in_seconds" => 3_600
             }

      conn
      |> Plug.Conn.put_resp_content_type("application/json")
      |> Plug.Conn.send_resp(
        201,
        Jason.encode!(%{
          "api_key" => "temporary-key",
          "expires_at" => "2026-11-15T19:00:00Z"
        })
      )
    end)

    assert GetTemporaryApiKey.configured?()

    assert {:ok, %{api_key: "temporary-key", expires_at: "2026-11-15T19:00:00Z"}} =
             GetTemporaryApiKey.call(plug: {Req.Test, __MODULE__})
  end

  test "returns an error when Soniox rejects the request" do
    Application.put_env(:twitch_overlays, :soniox, api_key: "permanent-key")

    Req.Test.stub(__MODULE__, fn conn ->
      conn
      |> Plug.Conn.put_resp_content_type("application/json")
      |> Plug.Conn.send_resp(401, ~s({"error":"invalid key"}))
    end)

    assert {:error, {:soniox_http, 401}} =
             GetTemporaryApiKey.call(plug: {Req.Test, __MODULE__})
  end
end
