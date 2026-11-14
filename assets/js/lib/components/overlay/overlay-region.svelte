<script lang="ts">
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;
  export let label: string | undefined = undefined;
  export let ratio: string | undefined = undefined;
  export let labelX = 16;
  export let labelY = 16;
  export let focus = false;
</script>

<div
  class="ov-region"
  class:ov-region--focus={focus}
  style={`left:${x}px;top:${y}px;width:${width}px;height:${height}px`}
>
  {#if label}
    <span class="ov-label" style={`left:${labelX}px;top:${labelY}px`}>
      {label}
    </span>
  {/if}

  {#if focus}
    <span class="ov-region__state" style={`right:${labelX}px;top:${labelY}px`}>
      locked in
    </span>
  {:else if ratio}
    <span class="ov-ratio" style={`right:${labelX}px;top:${labelY}px`}>
      {ratio}
    </span>
  {/if}

  <slot />
</div>
