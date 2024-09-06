<script lang="ts">
  import { router } from "@inertiajs/svelte";

  import Button from "$lib/components/button.svelte";
  import IntegrationStatus from "$lib/components/integration-status.svelte";
  import type {
    Subscription,
    AvailableSubscriptionType,
  } from "$lib/features/subscription";

  export let integrations: string[] = [];
  export let subscriptions: Subscription[] = [];
  export let twitch_sub_types: AvailableSubscriptionType[] = [];

  let loading: boolean = false;

  $: isTwitchConnected = integrations.includes("twitch");
  $: twitchSubscriptions = subscriptions.filter(
    (sub) => sub.platform === "twitch",
  );

  // There's obviously better ways to do this. Idc right now
  function isSubscribed(type: string) {
    return twitchSubscriptions.some((sub) => sub.type === type);
  }

  // Just one integration platform for now
  async function subscribeToEvent(type: string, platform: string = "twitch") {
    loading = true;

    await router.post("/admin/integrations/subscribe", {
      platform,
      type,
    });

    loading = false;
  }

  async function unsubscribeToEvent(type: string, platform: string = "twitch") {
    const subscription = subscriptions.find(
      (sub) => sub.type === type && sub.platform === platform,
    );
    if (!subscription) return;

    loading = true;

    await router.delete("/admin/integrations/unsubscribe/" + subscription.id);

    loading = false;
  }
</script>

<div
  class="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10"
>
  <h2 class="text-3xl">Integrations</h2>

  <section class="flex w-full flex-col gap-4">
    <div class="flex-start flex w-full flex-row items-center gap-4">
      <h3 class="text-2xl underline">Twitch</h3>
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

    <div class="w-full">
      <h4 class="mb-4 text-xl text-gray-600">Event subscriptions</h4>
      <div>
        {#each twitch_sub_types as subType, i (subType.type)}
          <div
            class={`px-2 py-4 ${i % 2 == 0 ? "bg-gray-100" : "bg-gray-50"} flex flex-row items-center justify-between`}
            on:submit|preventDefault={() => subscribeToEvent(subType.type)}
          >
            <p>{subType.name} ({subType.type})</p>
            <div class="flex w-fit flex-row items-center justify-end gap-4">
              <Button
                disabled={isSubscribed(subType.type) || loading}
                type="button"
                on:click={() => subscribeToEvent(subType.type, "twitch")}
              >
                Subscribe
              </Button>

              <Button
                type="button"
                on:click={() => unsubscribeToEvent(subType.type, "twitch")}
                >Unsubscribe</Button
              >
            </div>
          </div>
        {:else}
          <p>No subscription type available for this integration</p>
        {/each}
      </div>
    </div>
  </section>
</div>
