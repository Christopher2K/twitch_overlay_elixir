defmodule TwitchOverlays.Integration.SubscriptionRepo do
  import Ecto.Query, warn: false

  alias TwitchOverlays.Repo
  alias TwitchOverlays.Integration.Subscription

  def list(), do: {:ok, Repo.all(Subscription)}

  def upsert(type, service, attrs \\ %{}) do
    with {:ok, subscription} <- get_by_type_and_service(type, service) do
      subscription
      |> Subscription.changeset(attrs)
      |> Repo.update(returning: true)
    else
      {:error, :not_found} ->
        %Subscription{}
        |> Subscription.changeset(attrs)
        |> Repo.insert(returning: true)
    end
  end

  def get_by_type_and_service(type, platform) do
    from(Subscription, where: [type: ^type, platform: ^platform])
    |> Repo.one()
    |> case do
      nil -> {:error, :not_found}
      data -> {:ok, data}
    end
  end

  def get_by_id(id) do
    from(Subscription, where: [id: ^id])
    |> Repo.one()
    |> case do
      nil -> {:error, :not_found}
      data -> {:ok, data}
    end
  end

  def delete(id) do
    from(Subscription, where: [id: ^id]) |> Repo.delete_all()
  end
end
