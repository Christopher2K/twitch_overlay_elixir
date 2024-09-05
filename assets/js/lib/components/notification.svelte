<script lang="ts">
  import { fly } from "svelte/transition";
  import SmileFaceIcon from "$lib/icons/smile-face-icon.svelte";

  export let header: string;
  export let content: string;
</script>

<div
  class="card flex w-fit flex-row items-center justify-start gap-6 overflow-hidden bg-desktop px-6 py-2 text-white"
  transition:fly={{
    duration: 300,
    x: -100,
    opacity: 0,
  }}
>
  <div class="h-fit w-[60px] shrink-0">
    <SmileFaceIcon />
  </div>
  <div class="shrink-0">
    <p class="text-seven text-accent">{header}</p>
    <p class="text-six">{content}</p>
  </div>
</div>
