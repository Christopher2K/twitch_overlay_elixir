import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import LiveTicker from "$lib/components/overlay/live-ticker";
import NowPlayingPill from "$lib/components/overlay/now-playing-pill";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useLastfmMusic } from "$lib/features/music/hooks/use-lastfm-music";
import { trackLabel, trackTitle } from "$lib/features/music/track";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function Computer({ globalData: initialGlobalData }: Props) {
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
  const nowPlayingLabel = trackLabel(track);

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={1450.68}
        height={816}
        label="screen"
        ratio="16:9"
        labelX={20}
        labelY={18}
        focus={focus}
      />

      <OverlayBanner
        x={16}
        y={953.9}
        width={1450.68}
        title={globalData?.data.title}
        tag={globalData?.data.banner}
      />

      <NowPlayingPill
        x={1045.36}
        y={867.9}
        width={421.32}
        artwork={track?.artwork}
        track={nowPlaying}
        label={nowPlayingLabel}
      />

      <OverlayRegion
        x={1482.68}
        y={16}
        width={421.32}
        height={748.9}
        label="cam · 9:16"
        focus={focus}
      />

      <OverlayRegion
        x={1482.68}
        y={780.9}
        width={421.32}
        height={237}
        label="overhead"
        labelY={14}
        focus={focus}
      />

      <LiveTicker x={1482.68} y={1033.9} width={421.32} />
    </div>
  );
}
