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

export default function Overhead({ globalData: initialGlobalData }: Props) {
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
    <div className="ov-root">
      <OverlayRegion
        x={0}
        y={0}
        width={1920}
        height={1080}
        label="overhead"
        ratio="16:9"
        labelX={20}
        labelY={18}
        focus={focus}
      >
        <NowPlayingPill
          x={48}
          y={866}
          width={520}
          artwork={track?.artwork}
          track={nowPlaying}
          artist={nowPlayingArtist}
          label={nowPlayingLabel}
        />

        <OverlayBanner
          x={48}
          y={952}
          width={626}
          title={globalData?.data.title}
          tag={globalData?.data.banner}
        />
      </OverlayRegion>
    </div>
  );
}
