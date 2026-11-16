import { useEffect, useRef, useState } from "react";

import {
  clearPublishedCaptions,
  publishCaption,
  type CaptionPayload,
} from "../api";
import { captionWindow } from "../caption-window";

const PARTIAL_PUBLISH_INTERVAL_MS = 180;
const EMPTY_PAYLOAD: CaptionPayload = { partial: "", finalized: [] };

export function useCaptionPublisher(
  active: boolean,
  session: number,
  finalText: string,
  partialText: string,
) {
  const [error, setError] = useState<string | null>(null);
  const latest = useRef<CaptionPayload>(EMPTY_PAYLOAD);
  const sendNow = useRef<(() => void) | undefined>(undefined);
  const lastFinalized = useRef("");

  latest.current = captionWindow(finalText, partialText);

  const finalSignature = JSON.stringify(latest.current.finalized);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    let stopped = false;
    let lastSent = "";
    lastFinalized.current = "";
    setError(null);

    const send = () => {
      const payload = latest.current;
      if (!payload.partial && payload.finalized.length === 0) return;

      const serialized = JSON.stringify(payload);
      if (serialized === lastSent) return;

      lastSent = serialized;
      lastFinalized.current = JSON.stringify(payload.finalized);
      publishCaption(payload).catch((reason: unknown) => {
        if (!stopped) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not publish captions.",
          );
        }
      });
    };

    sendNow.current = send;
    const interval = window.setInterval(send, PARTIAL_PUBLISH_INTERVAL_MS);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      sendNow.current = undefined;
    };
  }, [active, session]);

  // A newly completed sentence should not wait for the partial-update timer.
  useEffect(() => {
    if (active && finalSignature !== lastFinalized.current) {
      sendNow.current?.();
    }
  }, [active, session, finalSignature]);

  useEffect(() => {
    if (!active || typeof window === "undefined") return;

    const clear = () => {
      void clearPublishedCaptions(true).catch(() => undefined);
    };
    window.addEventListener("pagehide", clear);

    return () => {
      window.removeEventListener("pagehide", clear);
      clear();
    };
  }, [active, session]);

  return { error, clearError: () => setError(null) };
}
