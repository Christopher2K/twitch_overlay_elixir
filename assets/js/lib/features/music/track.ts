import type { LastfmTrack } from "$lib/features/music/lastfm.types";

export function trackTitle(track?: LastfmTrack | null) {
  if (!track?.name) return undefined;
  return track.artist ? `${track.artist} — ${track.name}` : track.name;
}

export function trackMeta(track?: LastfmTrack | null) {
  return track?.album || undefined;
}

export function trackLabel(track?: LastfmTrack | null) {
  return track?.isPlaying ? "now playing" : "last scrobbled";
}
