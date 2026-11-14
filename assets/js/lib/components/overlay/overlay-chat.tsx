import type { ChatMessage } from "$lib/features/chat/chat.types";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  messages: ChatMessage[];
};

export default function OverlayChat({ x, y, width, height, messages }: Props) {
  return (
    <div className="ov-chat" style={{ left: x, top: y, width, height }}>
      <div className="ov-chat__head">
        <span className="ov-chat__live">
          <span className="ov-dot"></span>
          <span className="ov-chat__label">chat</span>
        </span>

        <span className="ov-chat__count">
          {messages.length ? `${messages.length} msgs` : "quiet"}
        </span>
      </div>

      <div className="ov-chat__list">
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
