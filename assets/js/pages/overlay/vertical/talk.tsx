import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import NowPlayingPill from "$lib/components/overlay/now-playing-pill";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useLastfmMusic } from "$lib/features/music/hooks/use-lastfm-music";
import { trackLabel, trackTitle } from "$lib/features/music/track";
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
  const { track } = useLastfmMusic();
  const nowPlaying = trackTitle(track);
  const nowPlayingLabel = trackLabel(track);

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
        <NowPlayingPill
          x={48}
          y={1690}
          width={520}
          artwork={track?.artwork}
          track={nowPlaying}
          label={nowPlayingLabel}
        />

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
