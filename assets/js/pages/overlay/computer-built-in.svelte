<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import type { GlobalMetadata } from "$lib/features/metadata";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";
  import MusicPlayer from "$lib/features/music/components/music-player.svelte";

  export let globalData: GlobalMetadata | null;

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }
  });
</script>

<div class="bg-desktop flex h-full w-full flex-row items-start justify-start">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-2 pt-4">
    <div class="card bg-placeholder aspect-macbook relative w-full">
      {#if globalData?.data.focusMode}
        <div
          class="absolute bottom-0 left-0 right-0 top-0 rounded-md border-[10px] border-red-400"
        ></div>
        <div
          class="absolute left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md bg-red-400 py-1"
        >
          <p class="text-six text-center text-white">
            Currently LOCKED-IN! I'm not talking I just CODEMAXXXING! Leave a
            message in the chat
          </p>
        </div>
      {/if}
    </div>
  </div>
  <!-- Cameras -->
  <div
    class="aspect-camera flex h-full w-[493px] flex-col items-center justify-center"
  >
    {#if globalData}
      <div
        class="absolute bottom-4 right-4 flex w-fit flex-col items-end justify-end gap-4"
      >
        <TitleBanner
          title={globalData.data.title}
          banner={globalData.data.banner}
        />

        <MusicPlayer />
      </div>
    {/if}
    <div class="w-full flex-1 pb-2 pl-2 pr-4 pt-4">
      <div class="card bg-placeholder aspect-vertical relative w-full">
        {#if globalData?.data.focusMode}
          <div
            class="absolute bottom-0 left-0 right-0 top-0 rounded-md border-[10px] border-red-400"
          ></div>

          <div
            class="absolute left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md bg-red-400 py-2"
          >
            <p class="text-seven text-center text-white">Man's locked-in...</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
