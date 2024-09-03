<script lang="ts">
  import { inertia } from "@inertiajs/svelte";
  import { cva, type VariantProps } from "class-variance-authority";

  type ButtonVariantProps = VariantProps<typeof buttonClasses>;

  export let type: "button" | "submit" = "button";
  export let disabled: boolean = false;
  export let isLink: boolean = false;
  export let href: string | undefined = undefined;

  export let fullWidth: ButtonVariantProps["fullWidth"] = false;
  export let size: ButtonVariantProps["size"] = "md";

  const buttonClasses = cva(
    "flex items-center justify-center gap-2 rounded-md border border-transparent bg-zinc-900 font-semibold text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      variants: {
        fullWidth: {
          true: "w-full",
          false: "w-fit",
        },
        size: {
          sm: "px-2 py-1 text-sm",
          md: "px-4 py-2 text-sm",
        },
      },
      defaultVariants: {
        fullWidth: false,
        size: "md",
      },
    },
  );
</script>

{#if isLink}
  <a
    {href}
    class={buttonClasses({ fullWidth, size })}
    aria-disabled={disabled}
    use:inertia
  >
    <slot />
  </a>
{:else}
  <button {type} class={buttonClasses({ fullWidth, size })} {disabled} on:click>
    <slot />
  </button>
{/if}
