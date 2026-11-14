import { useState } from "react";

import OverlayRegion from "$lib/components/overlay/overlay-region";
import OverlayTag from "$lib/components/overlay/overlay-tag";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import type { GuestMetadata, GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
  guestData: GuestMetadata | null;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function VideoGuest({
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
  const count = participants.length + 1;
  const feedWidth = (1888 - 16 * (count - 1)) / count;
  const tagWidth = Math.min(320, feedWidth - 40);

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={feedWidth}
        height={1048}
        label="host"
        labelX={20}
        labelY={20}
      >
        <span className="ov-onair" style={{ right: 20, top: 20 }}>
          on air
        </span>
        <OverlayTag
          x={20}
          y={976}
          width={tagWidth}
          name="llcoolchris"
          role="software engineer"
        />
      </OverlayRegion>

      {participants.map((participant, index) => (
        <OverlayRegion
          key={`${participant.name}-${index}`}
          x={16 + (index + 1) * (feedWidth + 16)}
          y={16}
          width={feedWidth}
          height={1048}
          label={`guest ${pad(index + 1)}`}
          labelX={20}
          labelY={20}
        >
          <OverlayTag
            x={20}
            y={976}
            width={tagWidth}
            name={participant.name}
            role={participant.description}
          />
        </OverlayRegion>
      ))}
    </div>
  );
}
