type Props = {
  x: number;
  y: number;
  width: number;
  artwork?: string;
  track?: string;
  label?: string;
};

export default function NowPlayingPill({
  x,
  y,
  width,
  artwork,
  track,
  label = "now playing",
}: Props) {
  if (!track) return null;

  return (
    <div className="ov-pill" style={{ left: x, top: y, width }}>
      {artwork ? (
        <img className="ov-pill__art" src={artwork} alt="" />
      ) : (
        <span className="ov-pill__art"></span>
      )}

      <span className="ov-pill__col">
        <span className="ov-pill__label">{label}</span>
        <span className="ov-pill__track">{track}</span>
      </span>
    </div>
  );
}
