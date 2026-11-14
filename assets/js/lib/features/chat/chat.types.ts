export type ChatBadge = "host" | "mod" | "sub" | "vip";

export type ChatFragment =
  | { type: "text"; text: string }
  | { type: "emote"; text: string; emote_id: string; animated: boolean };

export type ChatMessage = {
  id: string;
  author: string;
  /** Hex color from Twitch tags; falls back to the overlay accent. */
  color?: string | null;
  badge?: ChatBadge | null;
  /** Ordered message parts, so emotes can render as images. */
  fragments: ChatFragment[];
  /** ISO timestamp of when the overlay received the message. */
  sent_at: string;
};
