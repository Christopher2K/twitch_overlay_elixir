import OverlayTransition from "$lib/components/overlay/overlay-transition";

export default function Brb() {
  return (
    <div className="ov-root">
      <OverlayTransition
        status="away"
        headline="be right back"
        subline="rejoins le discord en attendant"
        action="[!discord] to join"
        accentDivider
      />
    </div>
  );
}
