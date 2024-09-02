<script lang="ts">
  import { cva } from "class-variance-authority";

  export let kind: "success" | "error" | "info";
  export let message: string;

  const alertClasses = cva(
    [
      "flex w-fit flex-col items-center justify-center gap-4 p-2 text-white rounded text-sm",
    ],
    {
      variants: {
        kind: {
          success: ["bg-emerald-500", "text-emerald-900"],
          error: ["bg-red-500", "text-red-900"],
          info: ["bg-zinc-700", "text-zinc-900"],
        },
      },
      defaultVariants: {
        kind: "info",
      },
    },
  );
</script>

<div class={alertClasses({ kind })}>
  <p>{message}</p>
</div>
