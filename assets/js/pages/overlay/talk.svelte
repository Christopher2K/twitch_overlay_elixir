<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayBanner from "$lib/components/overlay/overlay-banner.svelte";
  import LiveTicker from "$lib/components/overlay/live-ticker.svelte";
  import NowPlayingPill from "$lib/components/overlay/now-playing-pill.svelte";
  import { useCiderMusic } from "$lib/features/music/hooks/use-cider-music";
  import { trackTitle } from "$lib/features/music/track";
  import type { GlobalMetadata } from "$lib/features/metadata";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";

  export let globalData: GlobalMetadata | null;

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }
  });

  const { music } = useCiderMusic();
  $: track = trackTitle($music);
  $: focus = globalData?.data.focusMode ?? false;
</script>

<div class="ov-root">
  <OverlayRegion
    x={16}
    y={16}
    width={1888}
    height={1048}
    label="frame"
    labelX={32}
    labelY={30}
    {focus}
  >
    <OverlayBanner
      x={32}
      y={936}
      width={780}
      title={globalData?.data.title}
      tag={globalData?.data.banner}
    />

    <LiveTicker x={1434.68} y={970} width={421.32} />

    <NowPlayingPill
      x={32}
      y={850}
      width={520}
      artwork={$music.artwork}
      {track}
    />
  </OverlayRegion>
</div>
