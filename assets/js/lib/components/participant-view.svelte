<script lang="ts">
  import type { Participant } from "$lib/features/metadata";

  export let participant: Participant;
  export let isAudio = false;
</script>

<div
  class="card flex w-fit flex-row items-center justify-start gap-4 bg-desktop px-4 py-2 text-white"
>
  {#if isAudio}
    <div class="rounded-md bg-red-500 px-2 py-1">ON AIR</div>
  {/if}
  <div>
    {#if Boolean(participant.name)}
      <p class="text-seven">{participant.name}</p>
    {/if}
    {#if Boolean(participant.description)}
      <p class="text-eight">{participant.description}</p>
    {/if}
  </div>
</div>
