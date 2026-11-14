import { useEffect, useRef, useState } from "react";

import type { ChatMessage } from "../chat.types";
import { mockChatMessage } from "../mock-chat";

/** How many messages the widget keeps before older ones scroll off. */
export const CHAT_WINDOW = 8;

const SEED_MESSAGES = 3;
const MESSAGE_INTERVAL_MS = 2600;

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const cursor = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const push = () => {
      const message = mockChatMessage(cursor.current);
      cursor.current += 1;

      setMessages((current) => [...current, message].slice(-CHAT_WINDOW));
    };

    // Seed a short backlog so the widget is never blank on first paint.
    for (let index = 0; index < SEED_MESSAGES; index += 1) push();

    const timer = setInterval(push, MESSAGE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return { messages };
}
