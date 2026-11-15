import { useState } from "react";

import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import type { GuestMetadata, GlobalMetadata } from "$lib/features/metadata";

export type GuestOverlayProps = {
  globalData: GlobalMetadata | null;
  guestData: GuestMetadata | null;
};

export function useGuestOverlayData({
  globalData: initialGlobalData,
  guestData: initialGuestData,
}: GuestOverlayProps) {
  const [liveGlobalData, setLiveGlobalData] = useState<GlobalMetadata | null>(
    null,
  );
  const [liveGuestData, setLiveGuestData] = useState<GuestMetadata | null>(
    null,
  );

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      setLiveGlobalData(data);
    }

    if (data.name === "guests") {
      setLiveGuestData(data);
    }
  });

  const globalData = liveGlobalData ?? initialGlobalData;
  const guestData = liveGuestData ?? initialGuestData;

  return {
    globalData,
    participants: guestData?.data.members ?? [],
  };
}
