type PlayableTrack = {
  name?: string;
  artist?: string;
  album?: string;
  year?: string;
};

export function trackTitle(track?: PlayableTrack) {
  if (!track?.name) return undefined;
  return track.artist ? `${track.artist} — ${track.name}` : track.name;
}

export function trackMeta(track?: PlayableTrack) {
  if (!track) return undefined;
  return [track.album, track.year].filter(Boolean).join(" · ") || undefined;
}
