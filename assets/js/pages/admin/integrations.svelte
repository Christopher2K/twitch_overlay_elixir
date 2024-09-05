<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import IntegrationStatus from "$lib/components/integration-status.svelte";

  export let integrations: string[] = [];
  export let flash: Record<string, string> = {};

  $: isTwitchConnected = integrations.includes("twitch");
</script>

<div
  class="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10"
>
  <h2 class="text-3xl">Integrations</h2>

  <section class="flex w-full flex-col gap-4">
    <div class="flex-start flex w-full flex-row items-center gap-4">
      <h3 class="text-2xl">Twitch</h3>
      <IntegrationStatus isConnected={isTwitchConnected} />
    </div>

    {#if !isTwitchConnected}
      <Button
        size="sm"
        isLink
        href="/admin/integrations/twitch"
        disabled={isTwitchConnected}>Login with Twitch</Button
      >
    {/if}
  </section>
</div>
