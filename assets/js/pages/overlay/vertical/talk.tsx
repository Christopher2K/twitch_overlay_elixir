import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function VerticalTalk({ globalData: initialGlobalData }: Props) {
  const [liveGlobalData, setLiveGlobalData] = useState<GlobalMetadata | null>(
    null,
  );

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      setLiveGlobalData(data);
    }
  });

  const globalData = liveGlobalData ?? initialGlobalData;
  const focus = globalData?.data.focusMode ?? false;

  return (
    <div className="ov-root ov-root--vertical">
      <OverlayRegion
        x={16}
        y={16}
        width={1048}
        height={1888}
        label="frame"
        labelX={32}
        labelY={30}
        focus={focus}
      >
        <OverlayBanner
          x={48}
          y={1776}
          width={952}
          title={globalData?.data.title}
          tag={globalData?.data.banner}
        />
      </OverlayRegion>
    </div>
  );
}
