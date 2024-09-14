<script lang="ts">
  import { cva } from "class-variance-authority";

  export let label: string;
  export let htmlFor: string;
  export let inline = false;

  const containerClass = cva("flex w-full gap-2", {
    variants: {
      inline: {
        true: "flex-row items-center",
        false: "flex-col",
      },
    },
    defaultVariants: {
      inline: false,
    },
  });
</script>

<div class={containerClass({ inline })}>
  <label class="text-sm font-semibold text-zinc-800" for={htmlFor}
    >{label}</label
  >
  <slot />
</div>
