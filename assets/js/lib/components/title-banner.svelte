<script lang="ts">
  import { clsx } from "clsx";
  import { cva } from "class-variance-authority";

  export let position: "left" | "right" = "left";
  export let title: string | undefined = undefined;
  export let banner: string | undefined = undefined;

  $: shouldBeVisibile = Boolean(title || banner);

  const positionClasses = cva(["absolute", "bottom-0"], {
    variants: {
      position: {
        left: ["left-0"],
        right: ["right-0"],
      },
    },
    defaultVariants: {
      position: position,
    },
  });
</script>

{#if shouldBeVisibile}
  <div class={clsx(positionClasses({ position }), "w-fit p-8")}>
    <div class="card bg-desktop max-w-full p-4 text-white">
      {#if title}
        <p class="text-seven mb-1">📹 Now streaming...</p>
        <p class="text-six mb-2">
          {title}
        </p>
      {/if}

      {#if banner}
        <p class="text-seven text-white">{banner}</p>
      {/if}
    </div>
  </div>
{/if}
