<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import ParticipantView from "$lib/components/participant-view.svelte";
  import type { GlobalMetadata, GuestMetadata } from "$lib/features/metadata";

  export let globalData: GlobalMetadata | null;
  export let guestData: GuestMetadata | null;
  $: participants = guestData?.data.members ?? [];
</script>

<div class="flex h-full w-full flex-row items-start justify-start bg-desktop">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-2 pt-4">
    <div class="card relative h-full w-full bg-placeholder"></div>
    {#if globalData}
      <TitleBanner
        position="right"
        title={globalData.data.title}
        banner={globalData.data.banner}
      />
    {/if}
  </div>
  <!-- Cameras -->
  <div class="flex h-full w-[493px] flex-col items-center justify-center">
    <div class="relative w-full flex-1 pb-2 pl-2 pr-4 pt-4">
      <div class="card h-full w-full bg-placeholder"></div>
      <div class="absolute bottom-4 left-4 w-fit">
        <ParticipantView
          participant={{
            name: "@LLCoolChris_",
            description: "Software Engineer",
          }}
        />
      </div>
    </div>

    {#each participants as participant}
      <div class="relative w-full flex-1 pb-2 pl-2 pr-4 pt-4">
        <div class="card h-full w-full bg-placeholder"></div>
        <div class="absolute bottom-4 left-4 w-fit">
          <ParticipantView {participant} />
        </div>
      </div>
    {/each}
  </div>
</div>
