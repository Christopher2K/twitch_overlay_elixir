export type AudioParticipant = {
  name: string;
  role: string;
  onAir?: boolean;
};

type Props = {
  x: number;
  y: number;
  width?: number;
  participants?: AudioParticipant[];
};

export default function OverlayAudioStack({
  x,
  y,
  width = 340,
  participants = [],
}: Props) {
  if (participants.length === 0) return null;

  return (
    <div className="ov-audio-stack" style={{ left: x, top: y, width }}>
      {participants.map((participant, index) => (
        <div className="ov-audio-row" key={`${participant.name}-${index}`}>
          <span
            className={
              participant.onAir
                ? "ov-audio-row__mark ov-audio-row__mark--on"
                : "ov-audio-row__mark"
            }
          ></span>
          <span className="ov-audio-row__identity">
            <span className="ov-audio-row__name">{participant.name}</span>
            <span className="ov-audio-row__role">{participant.role}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
