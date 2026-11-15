import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import LiveTicker from "$lib/components/overlay/live-ticker";
import NowPlayingPanel from "$lib/components/overlay/now-playing-panel";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useLastfmMusic } from "$lib/features/music/hooks/use-lastfm-music";
import { trackLabel, trackMeta, trackTitle } from "$lib/features/music/track";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function ComputerSmall({
  globalData: initialGlobalData,
}: Props) {
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
  const { track } = useLastfmMusic();
  const nowPlaying = trackTitle(track);
  const nowPlayingMeta = trackMeta(track);
  const nowPlayingLabel = trackLabel(track);

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
        label="cam · 9:16"
        focus={focus}
      />

      <NowPlayingPanel
        x={1482.68}
        y={780.9}
        width={421.32}
        artwork={track?.artwork}
        track={nowPlaying}
        meta={nowPlayingMeta}
        label={nowPlayingLabel}
      />

      <LiveTicker x={1482.68} y={1033.9} width={421.32} />
    </div>
  );
}
