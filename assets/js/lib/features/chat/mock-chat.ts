import type { ChatMessage } from "./chat.types";

/**
 * Temporary stand-in for a live chat feed. Replace `mockChatMessage` with the
 * real source (Twitch IRC or an EventSub Phoenix channel) once it exists — the
 * page and widget only depend on the `ChatMessage` shape.
 */
const POOL: Array<Omit<ChatMessage, "id" | "time">> = [
  {
    author: "pixelpete",
    color: "#8ab4f8",
    text: "the new overlay looks so clean",
  },
  { author: "marbles", color: "#9ae6b4", text: "chat widget when 👀" },
  { author: "nightowl", color: "#f6c177", text: "audio is perfect tonight" },
  {
    author: "sunnyside",
    color: "#c4a7e7",
    text: "first time catching the stream live!",
  },
  {
    author: "corvid",
    color: "#7fd1c1",
    text: "+1 for a vertical layout version",
    badge: "sub",
  },
  { author: "quill", color: "#f28b82", text: "that transition was smooth" },
  {
    author: "tabs",
    color: "#ff6a3d",
    text: "mods, can we pin the schedule?",
    badge: "mod",
  },
  { author: "lowpoly", color: "#8ab4f8", text: "what keyboard is that?" },
  { author: "drift", color: "#9ae6b4", text: "lurking from the train 🚆" },
  {
    author: "hazel",
    color: "#f6c177",
    text: "the ticker timing is *chef's kiss*",
  },
  {
    author: "static",
    color: "#c4a7e7",
    text: "new follower here, hi everyone",
  },
  {
    author: "birdhouse",
    color: "#7fd1c1",
    text: "can you show the chat overlay again?",
    badge: "vip",
  },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function mockChatMessage(index: number): ChatMessage {
  const seed = POOL[index % POOL.length];
  const now = new Date();

  return {
    ...seed,
    id: `mock-${index}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
  };
}
