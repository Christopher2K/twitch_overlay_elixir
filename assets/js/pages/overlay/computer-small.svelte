<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayBanner from "$lib/components/overlay/overlay-banner.svelte";
  import LiveTicker from "$lib/components/overlay/live-ticker.svelte";
  import NowPlayingPanel from "$lib/components/overlay/now-playing-panel.svelte";
  import { useCiderMusic } from "$lib/features/music/hooks/use-cider-music";
  import { trackMeta, trackTitle } from "$lib/features/music/track";
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
  $: meta = trackMeta($music);
  $: focus = globalData?.data.focusMode ?? false;
</script>

<div class="ov-root">
  <OverlayRegion
    x={16}
    y={16}
    width={1290.67}
    height={968}
    label="screen"
    ratio="4:3"
    labelX={20}
    labelY={18}
    {focus}
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
    {focus}
  />

  <NowPlayingPanel
    x={1482.68}
    y={780.9}
    width={421.32}
    artwork={$music.artwork}
    {track}
    {meta}
  />

  <LiveTicker x={1482.68} y={1033.9} width={421.32} />
</div>
