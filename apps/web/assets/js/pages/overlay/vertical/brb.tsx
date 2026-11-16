import OverlayTransition from "$lib/components/overlay/overlay-transition";

export default function VerticalBrb() {
  return (
    <div className="ov-root ov-root--vertical">
      <OverlayTransition
        variant="vertical"
        status="away"
        headline="be right back"
        subline="rejoins le discord en attendant"
        action="[!discord] to join"
        accentDivider
      />
    </div>
  );
}
