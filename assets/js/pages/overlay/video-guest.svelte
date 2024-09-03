<script lang="ts">
  import ParticipantView from "$lib/components/participant-view.svelte";
  import TitleBanner from "$lib/components/title-banner.svelte";
  import type { Participant } from "$lib/features/metadata";

  export let participants: Participant[] = [
    { name: "LLCoolChris_", description: "Developeur web a Toronto" },
  ];
</script>

<div
  class="flex h-full w-full flex-row items-start justify-start gap-4 bg-desktop p-4"
>
  <div class="relative h-full w-full flex-1">
    <div class="card relative h-full w-full bg-placeholder"></div>
    <TitleBanner position="left" title="Computer" banner="I'm working on it" />
  </div>

  {#each participants as participant}
    <div class="relative h-full w-full flex-1">
      <div class="card relative h-full w-full bg-placeholder">
        <div class="absolute bottom-8 left-8 w-fit">
          <ParticipantView {participant} />
        </div>
      </div>
    </div>
  {/each}
</div>
