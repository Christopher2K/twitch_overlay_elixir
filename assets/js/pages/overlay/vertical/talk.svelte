<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayBanner from "$lib/components/overlay/overlay-banner.svelte";
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
    height={1888}
    label="frame"
    labelX={32}
    labelY={30}
    {focus}
  >
    <NowPlayingPill
      x={48}
      y={1690}
      width={520}
      artwork={$music.artwork}
      {track}
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
