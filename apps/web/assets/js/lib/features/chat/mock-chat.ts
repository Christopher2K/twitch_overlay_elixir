import type { ChatMessage } from "./chat.types";

/**
 * Preview feed for `/overlay/chat?source=mock`, so the widget can be laid out
 * in OBS without a live stream. Real messages arrive over `chat_room:lobby`.
 */
const POOL: Array<Omit<ChatMessage, "id" | "sent_at">> = [
  {
    author: "pixelpete",
    color: "#8ab4f8",
    fragments: [{ type: "text", text: "the new overlay looks so clean" }],
  },
  {
    author: "marbles",
    color: "#9ae6b4",
    fragments: [{ type: "text", text: "chat widget when " }],
  },
  {
    author: "nightowl",
    color: "#f6c177",
    fragments: [
      { type: "text", text: "audio is perfect tonight " },
      { type: "emote", text: "Kappa", emote_id: "25", animated: false },
    ],
  },
  {
    author: "sunnyside",
    color: "#c4a7e7",
    fragments: [{ type: "text", text: "first time catching the stream live!" }],
  },
  {
    author: "corvid",
    color: "#7fd1c1",
    badge: "sub",
    fragments: [
      { type: "text", text: "+1 for a vertical layout version " },
      { type: "emote", text: "heyguys", emote_id: "30259", animated: false },
    ],
  },
  {
    author: "quill",
    color: "#f28b82",
    fragments: [{ type: "text", text: "that transition was smooth" }],
  },
  {
    author: "tabs",
    color: "#ff6a3d",
    badge: "mod",
    fragments: [{ type: "text", text: "mods, can we pin the schedule?" }],
  },
  {
    author: "lowpoly",
    color: "#8ab4f8",
    fragments: [
      { type: "text", text: "what keyboard is that " },
      {
        type: "emote",
        text: "PogChamp",
        emote_id: "305954156",
        animated: true,
      },
    ],
  },
  {
    author: "drift",
    color: "#9ae6b4",
    fragments: [{ type: "text", text: "lurking from the train 🚆" }],
  },
  {
    author: "hazel",
    color: "#f6c177",
    fragments: [{ type: "text", text: "the ticker timing is *chef's kiss*" }],
  },
  {
    author: "static",
    color: "#c4a7e7",
    fragments: [{ type: "text", text: "new follower here, hi everyone" }],
  },
  {
    author: "birdhouse",
    color: "#7fd1c1",
    badge: "vip",
    fragments: [{ type: "text", text: "can you show the chat overlay again?" }],
  },
];

export function mockChatMessage(index: number): ChatMessage {
  const seed = POOL[index % POOL.length];

  return {
    ...seed,
    id: `mock-${index}`,
    sent_at: new Date().toISOString(),
  };
}
