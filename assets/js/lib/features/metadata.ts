export type Participant = {
  name: string;
  description: string;
};

export type GlobalMetadata = {
  name: "global";
  data: { banner: string; title: string };
};

export type GuestMetadata = {
  name: "guests";
  data: { members: Participant[] };
};

export type Metadata = Array<GlobalMetadata | GuestMetadata>;
