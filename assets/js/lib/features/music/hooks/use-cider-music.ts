import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { NowPlayingItemEvent, PlaybackTimeEvent } from "../music.types";

const CIDER_MUSIC_URL = "http://localhost:10767";
const CIDER_MUSIC_REST_URL = "http://localhost:10767";

export type Music = Partial<{
  name: string;
  artist: string;
  album: string;
  year: string;
  artwork: string;
  position: number;
  isPlaying: boolean;
}>;

export function useCiderMusic() {
  const [music, setMusic] = useState<Music>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    let socket: ReturnType<typeof io> | undefined;

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
          setMusic((old) => ({
            ...old,
            name: item.name,
            artist: item.artistName,
            album: item.albumName,
            year: item.releaseDate?.slice(0, 4),
            artwork: item.artwork.url,
            position: +(
              item.currentPlaybackTime /
              Math.round(item.durationInMillis / 1000)
            ).toFixed(2),
          }));
          break;

        case "playbackStatus.playbackStateDidChange":
          setMusic((old) => ({
            ...old,
            isPlaying: data.playbackState === "playing",
          }));
          break;

        case "playbackStatus.playbackTimeDidChange":
          const update = data as PlaybackTimeEvent;
          setMusic((old) => ({
            ...old,
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

    fetch(`${CIDER_MUSIC_REST_URL}/api/v1/playback/now-playing`)
      .then((res) => res.json())
      .then(({ info }: { info: NowPlayingItemEvent }) => {
        if (!info?.name) return;
        setMusic((old) => ({
          ...old,
          name: info.name,
          artist: info.artistName,
          album: info.albumName,
          year: info.releaseDate?.slice(0, 4),
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

    socket.io.on("error", () => {
      setMusic({});
    });

    return () => {
      socket?.off("API:Playback", handleAPIPlaybackEvents);
      socket?.disconnect();
    };
  }, []);

  return { music };
}
