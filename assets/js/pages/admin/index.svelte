<script lang="ts">
  import Alert from "$lib/components/alert.svelte";
  import GlobalInformationForm from "$lib/features/configuration/components/global-information-form.svelte";
  import GuestsForm from "$lib/features/configuration/components/guests-form.svelte";

  import type { Metadata } from "$lib/features/metadata";

  export let flash: Record<string, string>;
  export let metadata: Metadata = [];

  $: initialGlobalData = metadata.find((m) => m.name === "global")?.data ?? {
    banner: "",
    title: "",
  };
  $: initialGuestsData = metadata.find((m) => m.name === "guests")?.data ?? {
    members: [],
  };
</script>

<div
  class="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10"
>
  <div
    class="absolute left-[50%] top-8 flex w-fit translate-x-[-50%] flex-col items-end justify-start gap-4"
  >
    {#if flash.success}
      <Alert kind="success" message={flash.success} />
    {/if}
    {#if flash.error}
      <Alert kind="error" message={flash.error} />
    {/if}
  </div>

  <h2 class="text-3xl">Overlay configuration options</h2>
  <GlobalInformationForm initialData={initialGlobalData} />
  <GuestsForm initialData={initialGuestsData} />
</div>
