import type { ReactNode } from "react";

type Props = {
  variant?: "landscape" | "vertical";
  status: string;
  focus?: boolean;
  children?: ReactNode;
};

export default function OverlayStage({
  variant = "landscape",
  status,
  focus = false,
  children,
}: Props) {
  const vertical = variant === "vertical";
  const classes = [
    "ov-stage",
    vertical ? "ov-stage--vertical" : "",
    focus ? "ov-stage--focus" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={
        vertical
          ? { left: 16, top: 16, width: 1048, height: 1888 }
          : { left: 16, top: 16, width: 1888, height: 1048 }
      }
    >
      <span className="ov-stage__corner ov-stage__corner--left ov-stage__corner--top">
        llcoolchris // live
      </span>
      <span className="ov-stage__corner ov-stage__corner--right ov-stage__corner--top">
        {status}
      </span>
      <span className="ov-stage__corner ov-stage__corner--left ov-stage__corner--bottom">
        llcoolchris // twitch.tv
      </span>
      <span className="ov-stage__corner ov-stage__corner--right ov-stage__corner--bottom">
        [discord] to join
      </span>

      <div className="ov-stage__center">{children}</div>
    </div>
  );
}
