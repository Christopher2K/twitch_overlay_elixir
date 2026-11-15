import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import LiveTicker from "$lib/components/overlay/live-ticker";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function Talk({ globalData: initialGlobalData }: Props) {
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
    <div className="ov-root">
      <OverlayBanner
        x={48}
        y={952}
        width={626}
        title={globalData?.data.title}
        tag={globalData?.data.banner}
      />

      <OverlayRegion
        x={692.25}
        y={64}
        width={535.5}
        height={952}
        label="cam · 9:16"
        focus={focus}
      />

      <LiveTicker x={1450.68} y={986} width={421.32} />
    </div>
  );
}
