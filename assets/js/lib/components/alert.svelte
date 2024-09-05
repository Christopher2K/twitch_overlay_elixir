<script lang="ts">
  import { cva } from "class-variance-authority";
  import { XIcon } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let kind: "success" | "error" | "info";
  export let message: string;

  const alertClasses = cva(
    [
      "flex w-fit flex-row items-center justify-center gap-4 py-2 px-4 rounded text-sm border-2",
    ],
    {
      variants: {
        kind: {
          success: ["border-emerald-500", "text-emerald-900", "bg-emerald-100"],
          error: ["border-red-500", "text-red-900", "bg-red-100"],
          info: ["border-zinc-700", "text-zinc-900", "bg-zinc-100"],
        },
      },
      defaultVariants: {
        kind: "info",
      },
    },
  );

  function onXClick() {
    dispatch("close");
  }
</script>

<div class={alertClasses({ kind })}>
  <p>{message}</p>
  <button type="button" on:click={onXClick}>
    <XIcon />
  </button>
</div>
