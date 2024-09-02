<script lang="ts">
  export let type: "button" | "submit" = "button";
  export let disabled: boolean = false;
</script>

<button
  {type}
  class="flex w-full items-center justify-center rounded-lg border border-transparent bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  {disabled}
>
  <slot />
</button>
