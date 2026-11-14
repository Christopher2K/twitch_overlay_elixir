import type { ReactNode } from "react";

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  ratio?: string;
  labelX?: number;
  labelY?: number;
  focus?: boolean;
  children?: ReactNode;
};

export default function OverlayRegion({
  x,
  y,
  width,
  height,
  label,
  ratio,
  labelX = 16,
  labelY = 16,
  focus = false,
  children,
}: Props) {
  return (
    <div
      className={focus ? "ov-region ov-region--focus" : "ov-region"}
      style={{ left: x, top: y, width, height }}
    >
      {label ? (
        <span className="ov-label" style={{ left: labelX, top: labelY }}>
          {label}
        </span>
      ) : null}

      {focus ? (
        <span
          className="ov-region__state"
          style={{ right: labelX, top: labelY }}
        >
          locked in
        </span>
      ) : ratio ? (
        <span className="ov-ratio" style={{ right: labelX, top: labelY }}>
          {ratio}
        </span>
      ) : null}

      {children}
    </div>
  );
}
