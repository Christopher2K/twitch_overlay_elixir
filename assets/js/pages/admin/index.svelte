<script lang="ts">
  import GlobalInformationForm from "$lib/features/configuration/components/global-information-form.svelte";
  import GuestsForm from "$lib/features/configuration/components/guests-form.svelte";

  import type { Metadata } from "$lib/features/metadata";

  // export let flash: Record<string, string>;
  export let metadata: Metadata = [];
  $: initialGlobalData = metadata.find((m) => m.name === "global")?.data;
</script>

<div
  class="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10"
>
  <h2 class="text-3xl">Overlay configuration options</h2>
  <GlobalInformationForm initialData={initialGlobalData} />
  <GuestsForm />
</div>
