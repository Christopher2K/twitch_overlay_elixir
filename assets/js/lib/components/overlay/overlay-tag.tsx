type Props = {
  x: number;
  y: number;
  width?: number;
  name?: string;
  role?: string;
};

export default function OverlayTag({ x, y, width = 320, name, role }: Props) {
  if (!name && !role) return null;

  return (
    <div className="ov-tag" style={{ left: x, top: y, width }}>
      {name ? <span className="ov-tag__name">{name}</span> : null}
      {role ? <span className="ov-tag__role">{role}</span> : null}
    </div>
  );
}
