<script lang="ts">
  import { inertia } from "@inertiajs/svelte";
  import Button from "$lib/components/button.svelte";
  import Alert from "$lib/components/alert.svelte";

  export let flash: Record<string, string> = { success: "yes" };

  function onAlertClose() {
    flash = {};
  }
</script>

<nav class="static top-0 w-full">
  <div
    class="relative flex h-16 w-full flex-row items-center justify-between border-b px-4"
  >
    <div>
      <h1>Overlays control panel</h1>
    </div>

    <div class="flex flex-row items-center justify-end gap-4">
      <a use:inertia href="/admin" class="hover:underline">Configuration</a>
      <a use:inertia href="/admin/integrations" class="hover:underline"
        >Integrations</a
      >
      <Button isLink href="/admin/logout">Logout</Button>
    </div>

    {#if Object.keys(flash).length > 0}
      <div
        class="absolute -bottom-0 left-1/2 z-50 -translate-x-1/2 translate-y-[100%] p-4"
      >
        {#if flash.success}
          <Alert
            kind="success"
            message={flash.success}
            on:close={onAlertClose}
          />
        {:else if flash.error}
          <Alert kind="error" message={flash.error} on:close={onAlertClose} />
        {/if}
      </div>
    {/if}
  </div>
</nav>

<slot />
