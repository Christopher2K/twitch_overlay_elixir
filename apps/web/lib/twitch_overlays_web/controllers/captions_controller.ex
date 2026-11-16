defmodule TwitchOverlaysWeb.CaptionsController do
  require Logger
  use TwitchOverlaysWeb, :controller

  alias TwitchOverlays.Captions.Services.GetTemporaryApiKey
  alias TwitchOverlaysWeb.Endpoint

  @topic "overlay_room:lobby"
  @max_text_length 500
  @max_finalized_segments 2

  def index(conn, _params) do
    conn
    |> assign_prop(:sonioxConfigured, GetTemporaryApiKey.configured?())
    |> render_inertia("admin/captions")
  end

  def temporary_key(conn, _params) do
    case GetTemporaryApiKey.call() do
      {:ok, key} ->
        conn
        |> put_resp_header("cache-control", "no-store")
        |> json(key)

      {:error, :not_configured} ->
        conn
        |> put_status(:service_unavailable)
        |> json(%{error: "Soniox is not configured"})

      {:error, reason} ->
        Logger.warning("Could not issue a Soniox temporary key: #{inspect(reason)}")

        conn
        |> put_status(:bad_gateway)
        |> json(%{error: "Soniox is unavailable"})
    end
  end

  def publish(conn, %{"action" => "clear"}) do
    Endpoint.broadcast(@topic, "captions_clear", %{})
    json(conn, %{ok: true})
  end

  def publish(conn, params) do
    with {:ok, partial} <- validate_text(params, "partial"),
         {:ok, finalized} <- finalized(params) do
      payload = %{partial: partial, finalized: finalized}
      Endpoint.broadcast(@topic, "captions", payload)
      json(conn, %{ok: true})
    else
      {:error, :invalid} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Invalid caption payload"})
    end
  end

  defp validate_text(params, key) do
    case Map.get(params, key, "") do
      value when is_binary(value) ->
        if String.length(value) <= @max_text_length, do: {:ok, value}, else: {:error, :invalid}

      _ ->
        {:error, :invalid}
    end
  end

  defp finalized(params) do
    case Map.get(params, "finalized", []) do
      values when is_list(values) and length(values) <= @max_finalized_segments ->
        values
        |> Enum.reduce_while({:ok, []}, fn value, {:ok, acc} ->
          case validate_text(%{"value" => value}, "value") do
            {:ok, value} -> {:cont, {:ok, [value | acc]}}
            {:error, :invalid} -> {:halt, {:error, :invalid}}
          end
        end)
        |> case do
          {:ok, values} -> {:ok, Enum.reverse(values)}
          error -> error
        end

      _ ->
        {:error, :invalid}
    end
  end
end
