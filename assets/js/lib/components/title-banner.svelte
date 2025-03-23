<script lang="ts">
  export let title: string | undefined = undefined;
  export let banner: string | undefined = undefined;

  $: shouldBeVisibile = Boolean(title || banner);
</script>

{#if shouldBeVisibile}
  <div class="card h-fit w-fit max-w-full bg-desktop p-2 text-white">
    {#if banner}
      <p class="text-nine text-white">{banner}</p>
    {/if}

    {#if title}
      <p class="text-eight">
        {title}
      </p>
    {/if}
  </div>
{/if}
