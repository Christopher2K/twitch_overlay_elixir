type Props = {
  x: number;
  y: number;
  width: number;
  text?: string;
};

export default function OverlayTicker({ x, y, width, text }: Props) {
  if (!text) return null;

  return (
    <div className="ov-ticker" style={{ left: x, top: y, width }}>
      <span className="ov-ticker__mark">+</span>
      <span className="ov-ticker__text">{text}</span>
    </div>
  );
}
