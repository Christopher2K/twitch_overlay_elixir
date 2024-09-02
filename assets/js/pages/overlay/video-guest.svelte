<script lang="ts">
  import AudioParticipant from "$lib/components/audio-participant.svelte";
  import TitleBanner from "$lib/components/title-banner.svelte";
  import type { Participant } from "$lib/features/participants";

  export let participants: Participant[] = [];
</script>

<div
  class="bg-desktop flex h-full w-full flex-row items-start justify-start gap-4 p-4"
>
  <div class="relative h-full w-full flex-1">
    <div class="card bg-placeholder relative h-full w-full"></div>
    <TitleBanner position="left" title="Computer" banner="I'm working on it" />
  </div>

  {#each participants as participant}
    <div class="relative h-full w-full flex-1">
      <div class="card bg-placeholder relative h-full w-full">
        <div class="absolute bottom-8 left-8 w-fit">
          <AudioParticipant {participant} />
        </div>
      </div>
    </div>
  {/each}
</div>
