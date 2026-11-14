<script lang="ts">
  import OverlayTransition from "$lib/components/overlay/overlay-transition.svelte";
</script>

<div class="ov-root">
  <OverlayTransition
    status="starting"
    headline="starting soon"
    subline="ok, peut-être en retard"
    countdownSeconds={60 * 5}
  />
</div>
