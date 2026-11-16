import GuestsForm from "$lib/features/configuration/components/guests-form";
import GlobalInformationForm from "$lib/features/configuration/components/global-information-form";
import LastfmForm from "$lib/features/configuration/components/lastfm-form";
import type { Metadata } from "$lib/features/metadata";

type Props = {
  metadata?: Metadata;
};

export default function AdminIndex({ metadata = [] }: Props) {
  const initialGlobalData = metadata.find((m) => m.name === "global")?.data ?? {
    banner: "",
    title: "",
    focusMode: false,
  };
  const initialGuestsData = metadata.find((m) => m.name === "guests")?.data ?? {
    members: [],
  };
  const initialLastfmData = metadata.find((m) => m.name === "lastfm")?.data ?? {
    api_key: "",
    username: "",
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10">
      <h2 className="text-3xl">Overlay configuration options</h2>
      <GlobalInformationForm initialData={initialGlobalData} />
      <GuestsForm initialData={initialGuestsData} />
      <LastfmForm initialData={initialLastfmData} />
    </div>
  );
}
