import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import LiveTicker from "$lib/components/overlay/live-ticker";
import NowPlayingPanel from "$lib/components/overlay/now-playing-panel";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useCiderMusic } from "$lib/features/music/hooks/use-cider-music";
import { trackMeta, trackTitle } from "$lib/features/music/track";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function ComputerBuiltIn({
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
  const meta = trackMeta(music);
  const focus = globalData?.data.focusMode ?? false;

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={1290.67}
        height={806.67}
        label="screen"
        ratio="16:10"
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
        label="cam · 9:16"
        focus={focus}
      />

      <NowPlayingPanel
        x={1482.68}
        y={780.9}
        width={421.32}
        artwork={music.artwork}
        track={track}
        meta={meta}
      />

      <LiveTicker x={1482.68} y={1033.9} width={421.32} />
    </div>
  );
}
