<script lang="ts">
  export let x: number;
  export let y: number;
  export let width = 320;
  export let name: string | undefined = undefined;
  export let role: string | undefined = undefined;
</script>

{#if name || role}
  <div class="ov-tag" style={`left:${x}px;top:${y}px;width:${width}px`}>
    {#if name}
      <span class="ov-tag__name">{name}</span>
    {/if}
    {#if role}
      <span class="ov-tag__role">{role}</span>
    {/if}
  </div>
{/if}
