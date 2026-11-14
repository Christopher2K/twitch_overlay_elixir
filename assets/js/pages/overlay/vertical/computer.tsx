import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import LiveTicker from "$lib/components/overlay/live-ticker";
import NowPlayingPill from "$lib/components/overlay/now-playing-pill";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useCiderMusic } from "$lib/features/music/hooks/use-cider-music";
import { trackTitle } from "$lib/features/music/track";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function VerticalComputer({
  globalData: initialGlobalData,
}: Props) {
  const [liveGlobalData, setLiveGlobalData] = useState<GlobalMetadata | null>(
    null,
  );
  const { music } = useCiderMusic();

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      setLiveGlobalData(data);
    }
  });

  const globalData = liveGlobalData ?? initialGlobalData;
  const track = trackTitle(music);
  const focus = globalData?.data.focusMode ?? false;

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={1048}
        height={786}
        label="screen"
        ratio="4:3"
        labelX={20}
        labelY={18}
        focus={focus}
      />

      <OverlayBanner
        x={16}
        y={818}
        width={1048}
        title={globalData?.data.title}
        tag={globalData?.data.banner}
      />

      <OverlayRegion
        x={270}
        y={898}
        width={540}
        height={960}
        label="cam · 9:16"
        focus={focus}
      >
        <NowPlayingPill
          x={16}
          y={874}
          width={508}
          artwork={music.artwork}
          track={track}
        />
      </OverlayRegion>

      <LiveTicker x={270} y={1874} width={540} />
    </div>
  );
}
