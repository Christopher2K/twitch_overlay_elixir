<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import AudioParticipants from "$lib/components/audio-participants.svelte";
  import type { GlobalMetadata, GuestMetadata } from "$lib/features/metadata";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";

  export let globalData: GlobalMetadata | null;
  export let guestData: GuestMetadata | null;
  $: participants = guestData?.data.members ?? [];

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }

    if (data.name === "guests") {
      guestData = data;
    }
  });
</script>

<div class="flex h-full w-full flex-row items-start justify-start bg-desktop">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-4 pt-4">
    <div class="card relative h-full w-full bg-placeholder"></div>
    {#if globalData}
      <TitleBanner
        position="left"
        title={globalData.data.title}
        banner={globalData.data.banner}
      />
    {/if}

    <AudioParticipants
      participants={[
        { name: "LLCoolChris_", description: "Developeur web a Toronto" },
        ...participants,
      ]}
    />
  </div>
</div>
