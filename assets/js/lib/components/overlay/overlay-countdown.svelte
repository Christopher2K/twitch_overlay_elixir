<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let seconds = 60 * 5;

  let remaining = seconds;
  let timer: ReturnType<typeof setInterval> | undefined;

  $: done = remaining <= 0;
  $: formatted = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;

  function pad(value: number) {
    return String(Math.max(value, 0)).padStart(2, "0");
  }

  onMount(() => {
    timer = setInterval(() => {
      if (remaining <= 0) {
        if (timer) clearInterval(timer);
        return;
      }
      remaining -= 1;
    }, 1000);
  });

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

{#if !done}
  <div class="ov-countdown">
    <span class="ov-countdown__value">{formatted}</span>
  </div>
{/if}
