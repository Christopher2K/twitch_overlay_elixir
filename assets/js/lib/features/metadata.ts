export type GlobalMetadata = {
  name: "global";
  data: { banner: string; title: string };
};

export type GuestMetadata = {
  name: "guest";
  data: { name: string; description: string }[];
};

export type Metadata = Array<GlobalMetadata | GuestMetadata>;
