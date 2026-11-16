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

function withoutStaleFinalized(finalized: string[], stale: string[]) {
  for (
    let length = Math.min(finalized.length, stale.length);
    length > 0;
    length -= 1
  ) {
    const matches = stale
      .slice(-length)
      .every((text, index) => text === finalized[index]);

    if (matches) return finalized.slice(length);
  }

  return finalized;
}

export function useCaptions() {
  const [caption, setCaption] = useState<CaptionPayload>(EMPTY_CAPTION);
  const [fading, setFading] = useState(false);
  const lastPayload = useRef<CaptionPayload>(EMPTY_CAPTION);
  const staleFinalized = useRef<string[]>([]);
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

    const rememberFinalized = () => {
      staleFinalized.current = lastPayload.current.finalized;
    };

    const clear = () => {
      clearTimers();
      rememberFinalized();
      setFading(false);
      setCaption(EMPTY_CAPTION);
    };

    channel.on("captions", (data: unknown) => {
      if (!isCaptionPayload(data)) return;

      lastPayload.current = data;
      clearTimers();
      setCaption({
        partial: data.partial,
        finalized: withoutStaleFinalized(
          data.finalized,
          staleFinalized.current,
        ),
      });
      setFading(false);

      fadeTimer.current = setTimeout(() => {
        rememberFinalized();
        setFading(true);
      }, FADE_AFTER_MS);
      clearTimer.current = setTimeout(() => {
        rememberFinalized();
        setCaption(EMPTY_CAPTION);
      }, CLEAR_AFTER_MS);
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
