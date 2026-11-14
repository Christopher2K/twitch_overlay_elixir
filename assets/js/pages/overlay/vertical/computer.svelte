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
    width={1048}
    height={786}
    label="screen"
    ratio="4:3"
    labelX={20}
    labelY={18}
    {focus}
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
    {focus}
  >
    <NowPlayingPill
      x={16}
      y={874}
      width={508}
      artwork={$music.artwork}
      {track}
    />
  </OverlayRegion>

  <LiveTicker x={270} y={1874} width={540} />
</div>
