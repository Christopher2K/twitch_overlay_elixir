import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import OverlayTag from "$lib/components/overlay/overlay-tag";
import LiveTicker from "$lib/components/overlay/live-ticker";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import type { GuestMetadata, GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
  guestData: GuestMetadata | null;
};

export default function ComputerGuest({
  globalData: initialGlobalData,
  guestData: initialGuestData,
}: Props) {
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

  const participants = guestData?.data.members ?? [];
  const guest = participants[0];
  const focus = globalData?.data.focusMode ?? false;

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={1290.67}
        height={968}
        label="screen"
        ratio="4:3"
        labelX={20}
        labelY={18}
        focus={focus}
      />

      <OverlayBanner
        x={16}
        y={1000}
        width={1290.67}
        title={globalData?.data.title}
        tag={globalData?.data.banner}
      />

      <OverlayRegion
        x={1482.68}
        y={16}
        width={421.32}
        height={748.9}
        label="host"
        focus={focus}
      >
        <OverlayTag
          x={16}
          y={680.9}
          width={300}
          name="llcoolchris"
          role="software engineer"
        />
      </OverlayRegion>

      {guest ? (
        <OverlayRegion
          x={1482.68}
          y={780.9}
          width={421.32}
          height={237}
          label="guest 01"
          focus={focus}
        >
          <OverlayTag
            x={16}
            y={169}
            width={300}
            name={guest.name}
            role={guest.description}
          />
        </OverlayRegion>
      ) : null}

      <LiveTicker x={1482.68} y={1033.9} width={421.32} />
    </div>
  );
}
