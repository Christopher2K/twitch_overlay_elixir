<script lang="ts">
  export let x: number;
  export let y: number;
  export let width: number;
  export let text: string | undefined = undefined;
</script>

{#if text}
  <div class="ov-ticker" style={`left:${x}px;top:${y}px;width:${width}px`}>
    <span class="ov-ticker__mark">+</span>
    <span class="ov-ticker__text">{text}</span>
  </div>
{/if}
