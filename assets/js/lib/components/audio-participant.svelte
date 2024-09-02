<script lang="ts">
  import type { Participant } from "$lib/features/participants";
  export let participant: Participant;
</script>

<div
  class="card bg-desktop flex w-fit flex-row items-center justify-start gap-4 px-4 py-2 text-white"
>
  <div class="rounded-md bg-red-500 px-2 py-1">ON AIR</div>
  <div>
    {#if Boolean(participant.name)}
      <p class="text-seven">{participant.name}</p>
    {/if}
    {#if Boolean(participant.description)}
      <p class="text-eight">{participant.description}</p>
    {/if}
  </div>
</div>
