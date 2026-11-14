<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayBanner from "$lib/components/overlay/overlay-banner.svelte";
  import OverlayAudioStack from "$lib/components/overlay/overlay-audio-stack.svelte";
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
  $: rows = [
    { name: "llcoolchris", role: "développeur web · toronto", onAir: true },
    ...participants.map((participant) => ({
      name: participant.name,
      role: participant.description || "en écoute",
    })),
  ];
  // Anchored to the same bottom edge as the designed three-row stack.
  $: stackY = 1020 - 58 * rows.length;
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
  >
    <OverlayBanner
      x={32}
      y={936}
      width={780}
      title={globalData?.data.title}
      tag={globalData?.data.banner}
    />

    <OverlayAudioStack x={1516} y={stackY} width={340} participants={rows} />
  </OverlayRegion>
</div>
