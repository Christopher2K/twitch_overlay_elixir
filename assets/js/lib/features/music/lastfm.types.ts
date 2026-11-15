export type LastfmTrack = {
  name: string;
  artist?: string;
  album?: string;
  artwork?: string;
  url?: string;
  isPlaying: boolean;
};

export type LastfmNowPlayingResponse = {
  track: LastfmTrack | null;
};
