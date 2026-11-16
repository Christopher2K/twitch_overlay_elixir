import OverlayStage from "$lib/components/overlay/overlay-stage";
import OverlayCountdown from "$lib/components/overlay/overlay-countdown";

type Props = {
  variant?: "landscape" | "vertical";
  status: string;
  headline: string;
  subline: string;
  action?: string;
  accentDivider?: boolean;
  countdownSeconds?: number;
};

export default function OverlayTransition({
  variant = "landscape",
  status,
  headline,
  subline,
  action,
  accentDivider = false,
  countdownSeconds,
}: Props) {
  return (
    <OverlayStage variant={variant} status={status}>
      <h1 className="ov-stage__headline">{headline}</h1>

      <div
        className={
          accentDivider
            ? "ov-stage__rule ov-stage__rule--accent"
            : "ov-stage__rule"
        }
      ></div>

      <p className="ov-stage__sub">{subline}</p>

      {action ? <p className="ov-stage__action">{action}</p> : null}

      {countdownSeconds !== undefined ? (
        <OverlayCountdown seconds={countdownSeconds} />
      ) : null}
    </OverlayStage>
  );
}
