<script lang="ts">
  import OverlayRegion from "$lib/components/overlay/overlay-region.svelte";
  import OverlayTag from "$lib/components/overlay/overlay-tag.svelte";
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
  $: count = participants.length + 1;
  $: feedWidth = (1888 - 16 * (count - 1)) / count;
  $: tagWidth = Math.min(320, feedWidth - 40);

  function pad(value: number) {
    return String(value).padStart(2, "0");
  }
</script>

<div class="ov-root">
  <OverlayRegion
    x={16}
    y={16}
    width={feedWidth}
    height={1048}
    label="host"
    labelX={20}
    labelY={20}
  >
    <span class="ov-onair" style="right:20px;top:20px">on air</span>
    <OverlayTag
      x={20}
      y={976}
      width={tagWidth}
      name="llcoolchris"
      role="software engineer"
    />
  </OverlayRegion>

  {#each participants as participant, index}
    <OverlayRegion
      x={16 + (index + 1) * (feedWidth + 16)}
      y={16}
      width={feedWidth}
      height={1048}
      label={`guest ${pad(index + 1)}`}
      labelX={20}
      labelY={20}
    >
      <OverlayTag
        x={20}
        y={976}
        width={tagWidth}
        name={participant.name}
        role={participant.description}
      />
    </OverlayRegion>
  {/each}
</div>
