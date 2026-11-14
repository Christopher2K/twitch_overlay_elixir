import OverlayChat from "$lib/components/overlay/overlay-chat";
import { useChat } from "$lib/features/chat/hooks/use-chat";

// Fills the browser source; OBS sets the source size per scene.
export default function Chat() {
  const { messages } = useChat();

  return (
    <div className="ov-root">
      <OverlayChat messages={messages} />
    </div>
  );
}
