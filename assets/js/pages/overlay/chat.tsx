import OverlayChat from "$lib/components/overlay/overlay-chat";
import { CHAT_WINDOW, useChat } from "$lib/features/chat/hooks/use-chat";

// Right-hand rail, same 48px gutter as the banner and alert stack.
const CHAT = { x: 1452, y: 48, width: 420, height: 560 };

export default function Chat() {
  const { messages } = useChat();

  return (
    <div className="ov-root">
      <OverlayChat {...CHAT} messages={messages.slice(-CHAT_WINDOW)} />
    </div>
  );
}
