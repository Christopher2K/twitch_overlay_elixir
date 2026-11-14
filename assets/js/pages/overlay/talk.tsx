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

export default function Talk({ globalData: initialGlobalData }: Props) {
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
      <OverlayBanner
        x={48}
        y={952}
        width={780}
        title={globalData?.data.title}
        tag={globalData?.data.banner}
      />

      <OverlayRegion
        x={928.68}
        y={267.1}
        width={421.32}
        height={748.9}
        label="cam · 9:16"
        focus={focus}
      />

      <LiveTicker x={1450.68} y={986} width={421.32} />

      <NowPlayingPill
        x={48}
        y={866}
        width={520}
        artwork={music.artwork}
        track={track}
      />
    </div>
  );
}
