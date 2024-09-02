<script lang="ts">
  // import TitleBanner from "$lib/components/title-banner.svelte";
</script>

<div class="bg-desktop flex h-full w-full flex-row items-start justify-start">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-2 pt-4">
    <div class="card bg-placeholder relative h-full w-full"></div>
    <!-- <TitleBanner position="right" title="Computer" banner="I'm working on it" /> -->
  </div>
  <!-- Cameras -->
  <div class="flex h-full w-[493px] flex-col items-center justify-center">
    <div class="w-full flex-1 pb-2 pl-2 pr-4 pt-4">
      <div class="card bg-placeholder h-full w-full"></div>
    </div>
    <div class="aspect-video w-full pb-4 pl-2 pr-4 pt-2">
      <div class="card bg-placeholder h-full w-full"></div>
    </div>
  </div>
</div>
