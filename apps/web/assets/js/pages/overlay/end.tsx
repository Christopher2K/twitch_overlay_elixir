import OverlayTransition from "$lib/components/overlay/overlay-transition";

export default function End() {
  return (
    <div className="ov-root">
      <OverlayTransition
        status="offline"
        headline="see you next time"
        subline="merci d'être passé"
        action="follow pour la prochaine session"
      />
    </div>
  );
}
