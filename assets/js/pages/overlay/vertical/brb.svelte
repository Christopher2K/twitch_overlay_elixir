<script lang="ts">
  import OverlayTransition from "$lib/components/overlay/overlay-transition.svelte";
</script>

<div class="ov-root">
  <OverlayTransition
    variant="vertical"
    status="away"
    headline="be right back"
    subline="rejoins le discord en attendant"
    action="[!discord] to join"
    accentDivider
  />
</div>
