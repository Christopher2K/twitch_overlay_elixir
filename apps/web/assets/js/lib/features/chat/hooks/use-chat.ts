import { useEffect, useRef, useState } from "react";
import { Socket } from "phoenix";

import type { ChatMessage } from "../chat.types";
import { mockChatMessage } from "../mock-chat";

/** How many messages the overlay keeps in its scrollback. */
export const CHAT_WINDOW = 40;

const SEED_MESSAGES = 3;
const MESSAGE_INTERVAL_MS = 2600;
/** Preview the widget without EventSub: /overlay/chat?source=mock */
const MOCK_SOURCE = "mock";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const append = (message: ChatMessage) => {
      // EventSub retries a webhook when we answer slowly; drop duplicates.
      if (seen.current.has(message.id)) return;

      seen.current.add(message.id);

      if (seen.current.size > CHAT_WINDOW * 4) {
        seen.current = new Set([...seen.current].slice(-CHAT_WINDOW));
      }

      setMessages((current) => [...current, message].slice(-CHAT_WINDOW));
    };

    if (
      new URLSearchParams(window.location.search).get("source") === MOCK_SOURCE
    ) {
      let cursor = 0;
      const push = () => append(mockChatMessage(cursor++));

      // Seed a short backlog so the widget is never blank on first paint.
      for (let index = 0; index < SEED_MESSAGES; index += 1) push();

      const timer = setInterval(push, MESSAGE_INTERVAL_MS);

      return () => clearInterval(timer);
    }

    const socket = new Socket("/socket/events");
    const channel = socket.channel("chat_room:lobby");

    channel.on("chat", (message: ChatMessage) => append(message));

    socket.connect();
    channel.join();

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, []);

  return { messages };
}
