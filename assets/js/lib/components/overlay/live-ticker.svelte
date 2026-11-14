<script lang="ts">
  import { useAlerts } from "$lib/features/alerts/hooks/use-alerts";
  import OverlayTicker from "$lib/components/overlay/overlay-ticker.svelte";

  export let x: number;
  export let y: number;
  export let width: number;

  let text: string | undefined = undefined;

  useAlerts((data) => {
    text = data.content;
  });
</script>

<OverlayTicker {x} {y} {width} {text} />
