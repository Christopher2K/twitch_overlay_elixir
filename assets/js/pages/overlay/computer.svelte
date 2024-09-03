<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import type { GlobalMetadata } from "$lib/features/metadata";

  export let globalData: GlobalMetadata | null;
</script>

<div class="flex h-full w-full flex-row items-start justify-start bg-desktop">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-2 pt-4">
    <div class="card relative h-full w-full bg-placeholder"></div>
    {#if globalData}
      <TitleBanner
        position="right"
        title={globalData.data.title}
        banner={globalData.data.banner}
      />
    {/if}
  </div>
  <!-- Cameras -->
  <div class="flex h-full w-[493px] flex-col items-center justify-center">
    <div class="w-full flex-1 pb-2 pl-2 pr-4 pt-4">
      <div class="card h-full w-full bg-placeholder"></div>
    </div>
    <div class="aspect-video w-full pb-4 pl-2 pr-4 pt-2">
      <div class="card h-full w-full bg-placeholder"></div>
    </div>
  </div>
</div>
