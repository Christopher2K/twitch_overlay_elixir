<script lang="ts">
  export let x: number;
  export let y: number;
  export let width: number;
  export let height = 237;
  export let artwork: string | undefined = undefined;
  export let track: string | undefined = undefined;
  export let meta: string | undefined = undefined;
  export let label = "now playing";
</script>

{#if track}
  <div
    class="ov-panel"
    style={`left:${x}px;top:${y}px;width:${width}px;height:${height}px`}
  >
    <span class="ov-panel__label">{label}</span>

    {#if artwork}
      <img class="ov-panel__art" src={artwork} alt="" />
    {:else}
      <span class="ov-panel__art"></span>
    {/if}

    <span class="ov-panel__track">{track}</span>

    {#if meta}
      <span class="ov-panel__meta">{meta}</span>
    {/if}
  </div>
{/if}
