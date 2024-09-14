<script lang="ts">
  import TitleBanner from "$lib/components/title-banner.svelte";
  import type { GlobalMetadata } from "$lib/features/metadata";
  import { useConfigurationUpdate } from "$lib/features/configuration/hooks/use-configuration-update";

  export let globalData: GlobalMetadata | null;

  useConfigurationUpdate((data) => {
    if (data.name === "global") {
      globalData = data;
    }
  });
</script>

<div class="flex h-full w-full flex-row items-start justify-start bg-desktop">
  <!-- Main Screen -->
  <div class="relative h-full w-full flex-1 pb-4 pl-4 pr-2 pt-4">
    <div class="card relative h-full w-full bg-placeholder">
      {#if globalData?.data.focusMode}
        <div
          class="absolute bottom-0 left-0 right-0 top-0 rounded-md border-[10px] border-red-400"
        ></div>
        <div
          class="absolute left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md bg-red-400 py-1"
        >
          <p class="text-center text-six text-white">
            Currently LOCKED-IN! I'm not talking I just CODEMAXXXING! Leave a
            message in the chat
          </p>
        </div>
      {/if}
    </div>
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
      <div class="card relative h-full w-full bg-placeholder">
        {#if globalData?.data.focusMode}
          <div
            class="absolute bottom-0 left-0 right-0 top-0 rounded-md border-[10px] border-red-400"
          ></div>

          <div
            class="absolute left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md bg-red-400 py-2"
          >
            <p class="text-center text-seven text-white">Man's locked-in...</p>
          </div>
        {/if}
      </div>
    </div>
    <div class="aspect-video w-full pb-4 pl-2 pr-4 pt-2">
      <div class="card relative h-full w-full bg-placeholder">
        {#if globalData?.data.focusMode}
          <div
            class="absolute bottom-0 left-0 right-0 top-0 rounded-md border-[10px] border-red-400"
          ></div>

          <div
            class="absolute left-0 right-0 top-0 flex flex-col items-center justify-center rounded-md bg-red-400 py-2"
          >
            <p class="text-center text-seven text-white">
              Keyboard's locked-in...
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
