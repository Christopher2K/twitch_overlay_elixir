import { io } from "socket.io-client";
import { onDestroy, onMount } from "svelte";
import type { NowPlayingItemEvent, PlaybackTimeEvent } from "../music.types";
import { writable } from "svelte/store";

const CIDER_MUSIC_URL = "http://localhost:10767";
const CIDER_MUSIC_REST_URL = "http://localhost:10767";

export function useCiderMusic() {
  let socket: ReturnType<typeof io>;
  const music = writable<
    Partial<{
      name: string;
      artist: string;
      album: string;
      artwork: string;
      position: number;
      isPlaying: boolean;
    }>
  >({});

  function handleAPIPlaybackEvents({
    type,
    data,
  }: {
    type: string;
    data: any;
  }) {
    switch (type) {
      case "playbackStatus.nowPlayingItemDidChange":
        const item = data as NowPlayingItemEvent;
        music.update((old) => ({
          ...(old ?? {}),
          name: item.name,
          artist: item.artistName,
          album: item.albumName,
          artwork: item.artwork.url,
          position: +(
            item.currentPlaybackTime / Math.round(item.durationInMillis / 1000)
          ).toFixed(2),
        }));
        break;

      case "playbackStatus.playbackStateDidChange":
        music.update((old) => ({
          ...(old ?? {}),
          isPlaying: data.playbackState === "playing",
        }));
        break;

      case "playbackStatus.playbackTimeDidChange":
        const update = data as PlaybackTimeEvent;
        music.update((old) => ({
          ...(old ?? {}),
          isPlaying: update.isPlaying,
          position: +(
            update.currentPlaybackTime / update.currentPlaybackDuration
          ).toFixed(2),
        }));
        break;

      default:
        console.log("Unknown API Playback Event", type);
    }
  }

  onMount(() => {
    if (typeof window === "undefined") return;

    fetch(`${CIDER_MUSIC_REST_URL}/api/v1/playback/now-playing`)
      .then((res) => res.json())
      .then(({ info }: { info: NowPlayingItemEvent }) => {
        if (!info?.name) return;
        music.update((old) => ({
          ...(old ?? {}),
          name: info.name,
          artist: info.artistName,
          album: info.albumName,
          artwork: info.artwork.url,
          position: +(
            info.currentPlaybackTime / Math.round(info.durationInMillis / 1000)
          ).toFixed(2),
        }));
      })
      .catch();

    socket = io(CIDER_MUSIC_URL, {
      retries: Infinity,
    });

    socket.io.on("open", () => {
      console.log("Connected to Cider Music");
    });

    socket.on("API:Playback", handleAPIPlaybackEvents);

    socket.io.on("error", (_) => {
      music.set({});
    });
  });

  onDestroy(() => {
    if (socket) {
      socket.disconnect();
      socket.off("API:Playback", handleAPIPlaybackEvents);
    }
  });

  return { music };
}
