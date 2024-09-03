<script lang="ts">
  export let id: string;
  export let type: "password" | "text" = "text";
  export let value: string = "";

  const classes =
    "block w-full rounded-lg border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
</script>

{#if type === "password"}
  <input {id} type="password" class={classes} bind:value />
{:else}
  <input
    {id}
    type="text"
    class="block w-full rounded-lg border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    bind:value
  />
{/if}
