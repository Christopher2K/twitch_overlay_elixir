defmodule TwitchOverlays.Webhooks.Alert do
  @derive Jason.Encoder
  @enforce_keys [:id, :header, :content]
  defstruct [:id, :header, :content, sound: nil, icon: nil]

  def new(header, content, sound \\ nil) do
    %__MODULE__{
      id: Ecto.UUID.generate(),
      header: header,
      content: content,
      sound: sound
    }
  end
end
