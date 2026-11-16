import { useEffect, useRef, useState } from "react";
import { Socket } from "phoenix";

import type { CaptionPayload } from "../api";

const EMPTY_CAPTION: CaptionPayload = { partial: "", finalized: [] };
const FADE_AFTER_MS = 7_000;
const CLEAR_AFTER_MS = 7_500;

function isCaptionPayload(data: unknown): data is CaptionPayload {
  if (!data || typeof data !== "object") return false;
  const payload = data as Partial<CaptionPayload>;

  return (
    typeof payload.partial === "string" &&
    Array.isArray(payload.finalized) &&
    payload.finalized.every((text) => typeof text === "string")
  );
}

export function useCaptions() {
  const [caption, setCaption] = useState<CaptionPayload>(EMPTY_CAPTION);
  const [fading, setFading] = useState(false);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = new Socket("/socket/events");
    const channel = socket.channel("overlay_room:lobby");

    const clearTimers = () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };

    const clear = () => {
      clearTimers();
      setFading(false);
      setCaption(EMPTY_CAPTION);
    };

    channel.on("captions", (data: unknown) => {
      if (!isCaptionPayload(data)) return;

      clearTimers();
      setCaption(data);
      setFading(false);

      fadeTimer.current = setTimeout(() => setFading(true), FADE_AFTER_MS);
      clearTimer.current = setTimeout(
        () => setCaption(EMPTY_CAPTION),
        CLEAR_AFTER_MS,
      );
    });
    channel.on("captions_clear", clear);

    socket.connect();
    channel.join();

    return () => {
      clearTimers();
      channel.leave();
      socket.disconnect();
    };
  }, []);

  return { caption, fading };
}
