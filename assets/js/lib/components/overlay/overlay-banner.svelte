<script lang="ts">
  export let x: number;
  export let y: number;
  export let width: number;
  export let title: string | undefined = undefined;
  export let tag: string | undefined = undefined;

  $: visible = Boolean(title || tag);
</script>

{#if visible}
  <div class="ov-banner" style={`left:${x}px;top:${y}px;width:${width}px`}>
    <div class="ov-banner__live">
      <span class="ov-dot"></span>
      <span class="ov-banner__word">live</span>
    </div>

    {#if title}
      <span class="ov-banner__title">{title}</span>
    {/if}

    {#if tag}
      <span class="ov-banner__tag">{tag}</span>
    {/if}
  </div>
{/if}
