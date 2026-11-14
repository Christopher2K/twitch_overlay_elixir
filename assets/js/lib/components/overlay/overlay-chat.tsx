import { useEffect, useRef } from "react";

import type { ChatFragment, ChatMessage } from "$lib/features/chat/chat.types";

type Props = {
  messages: ChatMessage[];
};

type EmoteFragment = Extract<ChatFragment, { type: "emote" }>;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function clock(sentAt: string) {
  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function emoteUrl(fragment: EmoteFragment) {
  const format = fragment.animated ? "animated" : "static";

  return `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(fragment.emote_id)}/${format}/dark/1.0`;
}

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

                <span className="ov-chat__time">{clock(message.sent_at)}</span>
              </div>

              <span className="ov-chat__text">
                {message.fragments.map((fragment, index) =>
                  fragment.type === "emote" ? (
                    <img
                      key={`${message.id}-${index}`}
                      className="ov-chat__emote"
                      src={emoteUrl(fragment)}
                      alt={fragment.text}
                    />
                  ) : (
                    <span key={`${message.id}-${index}`}>{fragment.text}</span>
                  ),
                )}
              </span>
            </div>
          ))
        ) : (
          <span className="ov-chat__empty">waiting for chat</span>
        )}
      </div>
    </div>
  );
}
