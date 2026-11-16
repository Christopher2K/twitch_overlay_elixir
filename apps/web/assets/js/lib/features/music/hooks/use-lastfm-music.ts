import { useEffect, useState } from "react";

import type {
  LastfmNowPlayingResponse,
  LastfmTrack,
} from "$lib/features/music/lastfm.types";

const NOW_PLAYING_URL = "/api/lastfm/now-playing";
const REFRESH_INTERVAL = 15_000;

export function useLastfmMusic() {
  const [track, setTrack] = useState<LastfmTrack | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(NOW_PLAYING_URL, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = (await response.json()) as LastfmNowPlayingResponse;
        if (!cancelled) setTrack(data.track);
      } catch {
        // Keep the last known track while Last.fm is temporarily unavailable.
      }
    }

    void load();
    const interval = window.setInterval(load, REFRESH_INTERVAL);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return { track };
}
