<script lang="ts">
  import OverlayStage from "$lib/components/overlay/overlay-stage.svelte";
  import OverlayCountdown from "$lib/components/overlay/overlay-countdown.svelte";

  export let variant: "landscape" | "vertical" = "landscape";
  export let status: string;
  export let headline: string;
  export let subline: string;
  export let action: string | undefined = undefined;
  export let accentDivider = false;
  export let countdownSeconds: number | undefined = undefined;
</script>

<OverlayStage {variant} {status}>
  <h1 class="ov-stage__headline">{headline}</h1>

  <div
    class="ov-stage__rule"
    class:ov-stage__rule--accent={accentDivider}
  ></div>

  <p class="ov-stage__sub">{subline}</p>

  {#if action}
    <p class="ov-stage__action">{action}</p>
  {/if}

  {#if countdownSeconds !== undefined}
    <OverlayCountdown seconds={countdownSeconds} />
  {/if}
</OverlayStage>
