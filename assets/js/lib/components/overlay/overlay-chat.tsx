import { useEffect, useRef } from "react";

import type { ChatMessage } from "$lib/features/chat/chat.types";

type Props = {
  messages: ChatMessage[];
};

/**
 * Fills whatever box it is placed in. The overlay page hands sizing to OBS,
 * so the browser source dimensions decide the panel size.
 */
export default function OverlayChat({ messages }: Props) {
  const list = useRef<HTMLDivElement>(null);

  // Keep the newest message in view once the list outgrows the panel.
  useEffect(() => {
    const element = list.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages]);

  return (
    <div className="ov-chat">
      <div className="ov-chat__head">
        <span className="ov-chat__live">
          <span className="ov-dot"></span>
          <span className="ov-chat__label">chat</span>
        </span>

        <span className="ov-chat__count">
          {messages.length ? `${messages.length} msgs` : "quiet"}
        </span>
      </div>

      <div ref={list} className="ov-chat__list">
        {messages.length ? (
          messages.map((message) => (
            <div key={message.id} className="ov-chat__row">
              <div className="ov-chat__meta">
                <span
                  className="ov-chat__author"
                  style={message.color ? { color: message.color } : undefined}
                >
                  {message.author}
                </span>

                {message.badge ? (
                  <span className="ov-chat__badge">{message.badge}</span>
                ) : null}

                <span className="ov-chat__time">{message.time}</span>
              </div>

              <span className="ov-chat__text">{message.text}</span>
            </div>
          ))
        ) : (
          <span className="ov-chat__empty">waiting for chat</span>
        )}
      </div>
    </div>
  );
}
