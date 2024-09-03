<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
  import type { GlobalMetadata } from "$lib/features/metadata";

  export let globalData: GlobalMetadata | null;

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }
  });
</script>

<div class="flex h-full w-full flex-row items-start justify-start bg-desktop">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-4 pt-4">
    <div class="card relative h-full w-full bg-placeholder"></div>
    {#if globalData}
      <TitleBanner
        position="left"
        title={globalData.data.title}
        banner={globalData.data.banner}
      />
    {/if}
  </div>
</div>
