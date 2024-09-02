<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let countdownSeconds: number = 60 * 5;
  let interval: number;

  $: minutes = Math.floor(countdownSeconds / 60);
  $: seconds = countdownSeconds % 60;
  $: formattedSeconds = `${pad(minutes)}:${pad(seconds)}`;
  $: isDone = countdownSeconds <= 0;

  function pad(num: number) {
    return String(num).padStart(2, "0");
  }

  onMount(() => {
    setInterval(() => {
      if (countdownSeconds <= 0) {
        clearInterval(interval);
      }
      countdownSeconds = countdownSeconds - 1;
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

{#if isDone}
  <slot />
{:else}
  <div class="w-fit rounded-lg border-4 border-white px-4">
    <p class="text-four tabular-nums text-white">
      {formattedSeconds}
    </p>
  </div>
{/if}
