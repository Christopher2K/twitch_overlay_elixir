type Props = {
  kind: string;
  header: string;
  content: string;
  time: string;
};

export default function OverlayAlert({ kind, header, content, time }: Props) {
  return (
    <div className="ov-alert">
      <span className="ov-alert__mark">{kind}</span>
      <span className="ov-alert__header">{header}</span>
      <span className="ov-alert__content">{content}</span>
      <span className="ov-alert__time">{time}</span>
    </div>
  );
}
