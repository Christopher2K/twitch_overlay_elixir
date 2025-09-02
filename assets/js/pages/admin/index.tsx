import GlobalInformationForm from "../../lib/features/configuration/components/global-information-form";
import GuestsForm from "../../lib/features/configuration/components/guests-form";
import type { Metadata } from "../../lib/features/metadata";
import { useMemo } from "react";

interface AdminIndexProps {
  metadata: Metadata;
}

export default function AdminIndex({ metadata = [] }: AdminIndexProps) {
  const initialGlobalData = useMemo(() => {
    return metadata.find((m) => m.name === "global")?.data ?? {
      banner: "",
      title: "",
      focusMode: false,
    };
  }, [metadata]);

  const initialGuestsData = useMemo(() => {
    return metadata.find((m) => m.name === "guests")?.data ?? {
      members: [],
    };
  }, [metadata]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10">
      <h2 className="text-3xl">Overlay configuration options</h2>
      <GlobalInformationForm initialData={initialGlobalData} />
      <GuestsForm initialData={initialGuestsData} />
    </div>
  );
}