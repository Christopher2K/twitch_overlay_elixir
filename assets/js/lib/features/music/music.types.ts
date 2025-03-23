type Artwork = {
  width: number;
  height: number;
  url: string;
};

type PlayParams = {
  id: string;
  kind: string;
};

type Preview = {
  url: string;
};

export type NowPlayingItemEvent = {
  hasTimeSyncedLyrics: boolean;
  albumName: string;
  genreNames: string[];
  trackNumber: number;
  releaseDate: string;
  durationInMillis: number;
  isVocalAttenuationAllowed: boolean;
  isMasteredForItunes: boolean;
  isrc: string;
  artwork: Artwork;
  audioLocale: string;
  composerName: string;
  playParams: PlayParams;
  url: string;
  discNumber: number;
  isAppleDigitalMaster: boolean;
  hasLyrics: boolean;
  audioTraits: string[];
  name: string;
  previews: Preview[];
  artistName: string;
  contentRating: string;
  currentPlaybackTime: number;
  remainingTime: number;
};

export type PlaybackTimeEvent = {
  currentPlaybackTime: number;
  currentPlaybackDuration: number;
  isPlaying: boolean;
};
