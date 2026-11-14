type Props = {
  x: number;
  y: number;
  width: number;
  height?: number;
  artwork?: string;
  track?: string;
  meta?: string;
  label?: string;
};

export default function NowPlayingPanel({
  x,
  y,
  width,
  height = 237,
  artwork,
  track,
  meta,
  label = "now playing",
}: Props) {
  if (!track) return null;

  return (
    <div className="ov-panel" style={{ left: x, top: y, width, height }}>
      <span className="ov-panel__label">{label}</span>

      {artwork ? (
        <img className="ov-panel__art" src={artwork} alt="" />
      ) : (
        <span className="ov-panel__art"></span>
      )}

      <span className="ov-panel__track">{track}</span>

      {meta ? <span className="ov-panel__meta">{meta}</span> : null}
    </div>
  );
}
