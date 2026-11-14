<script lang="ts">
  export let x: number;
  export let y: number;
  export let width: number;
  export let artwork: string | undefined = undefined;
  export let track: string | undefined = undefined;
  export let label = "now playing";
</script>

{#if track}
  <div class="ov-pill" style={`left:${x}px;top:${y}px;width:${width}px`}>
    {#if artwork}
      <img class="ov-pill__art" src={artwork} alt="" />
    {:else}
      <span class="ov-pill__art"></span>
    {/if}

    <span class="ov-pill__col">
      <span class="ov-pill__label">{label}</span>
      <span class="ov-pill__track">{track}</span>
    </span>
  </div>
{/if}
