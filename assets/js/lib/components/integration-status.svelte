<script lang="ts">
  export let isConnected: boolean = false;
</script>

<div
  class:bg-emerald-500={isConnected}
  class:bg-rose-500={!isConnected}
  class="flex w-fit flex-row items-center justify-start rounded-md p-1 text-xs text-white"
>
  {#if isConnected}
    Connected
  {:else}
    Disconnected
  {/if}
</div>
