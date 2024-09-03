<script lang="ts">
  import type { Participant } from "$lib/features/metadata";
  import ParticipantView from "$lib/components/participant-view.svelte";

  export let participants: Participant[] = [];
</script>

{#if participants.length > 0}
  <div
    class="absolute bottom-0 right-0 flex w-fit flex-col items-end justify-start gap-4 p-8"
  >
    {#each participants as participant}
      <ParticipantView {participant} isAudio />
    {/each}
  </div>
{/if}
