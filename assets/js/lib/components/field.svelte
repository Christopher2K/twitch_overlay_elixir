<script lang="ts">
  export let label: string;
  export let htmlFor: string;
</script>

<div class="flex w-full flex-col gap-2">
  <label class="text-sm font-semibold text-zinc-800" for={htmlFor}
    >{label}</label
  >
  <slot />
</div>
