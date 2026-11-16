import OverlayTransition from "$lib/components/overlay/overlay-transition";

export default function VerticalEnd() {
  return (
    <div className="ov-root ov-root--vertical">
      <OverlayTransition
        variant="vertical"
        status="offline"
        headline="see you next time"
        subline="merci d'être passé"
        action="follow pour la prochaine session"
      />
    </div>
  );
}
