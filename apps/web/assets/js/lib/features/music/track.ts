import type { LastfmTrack } from "$lib/features/music/lastfm.types";

export function trackTitle(track?: LastfmTrack | null) {
  return track?.name || undefined;
}

export function trackArtist(track?: LastfmTrack | null) {
  return track?.artist || undefined;
}

export function trackLabel(track?: LastfmTrack | null) {
  return track?.isPlaying ? "now playing" : "last scrobbled";
}
