export type ChatBadge = "mod" | "sub" | "vip";

export type ChatMessage = {
  id: string;
  author: string;
  /** Hex color from Twitch tags; falls back to the overlay accent. */
  color?: string;
  text: string;
  badge?: ChatBadge;
  /** Display clock, `HH:MM`. */
  time: string;
};
