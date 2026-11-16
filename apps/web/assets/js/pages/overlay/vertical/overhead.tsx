import { useState } from "react";

import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import NowPlayingPill from "$lib/components/overlay/now-playing-pill";
import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
import { useLastfmMusic } from "$lib/features/music/hooks/use-lastfm-music";
import { trackArtist, trackLabel, trackTitle } from "$lib/features/music/track";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  globalData: GlobalMetadata | null;
};

export default function VerticalOverhead({
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
  const nowPlayingArtist = trackArtist(track);
  const nowPlayingLabel = trackLabel(track);

  return (
    <div className="ov-root ov-root--vertical">
      <OverlayRegion
        x={0}
        y={0}
        width={1080}
        height={1920}
        label="overhead"
        ratio="9:16"
        labelX={20}
        labelY={18}
        focus={focus}
      >
        <NowPlayingPill
          x={64}
          y={1706}
          width={520}
          artwork={track?.artwork}
          track={nowPlaying}
          artist={nowPlayingArtist}
          label={nowPlayingLabel}
        />

        <OverlayBanner
          x={64}
          y={1792}
          width={952}
          title={globalData?.data.title}
          tag={globalData?.data.banner}
        />
      </OverlayRegion>
    </div>
  );
}
