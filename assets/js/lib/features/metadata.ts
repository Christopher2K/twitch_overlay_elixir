export type Participant = {
  name: string;
  description: string;
};

export type GlobalMetadata = {
  name: "global";
  data: { banner: string; title: string; focusMode: boolean };
};

export type GuestMetadata = {
  name: "guests";
  data: { members: Participant[] };
};

export type LastfmMetadata = {
  name: "lastfm";
  data: { api_key: string; username: string };
};

export type Metadata = Array<GlobalMetadata | GuestMetadata | LastfmMetadata>;
