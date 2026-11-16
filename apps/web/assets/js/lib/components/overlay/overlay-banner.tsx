type Props = {
  x: number;
  y: number;
  width: number;
  title?: string;
  tag?: string;
};

export default function OverlayBanner({ x, y, width, title, tag }: Props) {
  if (!title && !tag) return null;

  return (
    <div className="ov-banner" style={{ left: x, top: y, width }}>
      <div className="ov-banner__live">
        <span className="ov-dot"></span>
        <span className="ov-banner__word">live</span>
      </div>

      {title ? <span className="ov-banner__title">{title}</span> : null}

      {tag ? <span className="ov-banner__tag">{tag}</span> : null}
    </div>
  );
}
