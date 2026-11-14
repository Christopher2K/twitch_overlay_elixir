<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayBanner from "$lib/components/overlay/overlay-banner.svelte";
  import OverlayTag from "$lib/components/overlay/overlay-tag.svelte";
  import LiveTicker from "$lib/components/overlay/live-ticker.svelte";
  import type { GlobalMetadata, GuestMetadata } from "$lib/features/metadata";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";

  export let globalData: GlobalMetadata | null;
  export let guestData: GuestMetadata | null;

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }

    if (data.name === "guests") {
      guestData = data;
    }
  });

  $: participants = guestData?.data.members ?? [];
  $: guest = participants[0];
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
    label="host"
    {focus}
  >
    <OverlayTag
      x={16}
      y={680.9}
      width={300}
      name="llcoolchris"
      role="software engineer"
    />
  </OverlayRegion>

  {#if guest}
    <OverlayRegion
      x={1482.68}
      y={780.9}
      width={421.32}
      height={237}
      label="guest 01"
      {focus}
    >
      <OverlayTag
        x={16}
        y={169}
        width={300}
        name={guest.name}
        role={guest.description}
      />
    </OverlayRegion>
  {/if}

  <LiveTicker x={1482.68} y={1033.9} width={421.32} />
</div>
