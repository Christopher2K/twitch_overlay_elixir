import OverlayTransition from "$lib/components/overlay/overlay-transition";

export default function Start() {
  return (
    <div className="ov-root">
      <OverlayTransition
        status="starting"
        headline="starting soon"
        subline="ok, peut-être en retard"
        countdownSeconds={60 * 5}
      />
    </div>
  );
}
