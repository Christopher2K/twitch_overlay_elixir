import { useEffect, useState } from "react";

type Props = {
  seconds?: number;
};

function pad(value: number) {
  return String(Math.max(value, 0)).padStart(2, "0");
}

export default function OverlayCountdown({ seconds = 60 * 5 }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const formatted = `${pad(Math.floor(remaining / 60))}:${pad(remaining % 60)}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((value) => (value <= 0 ? 0 : value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (remaining <= 0) return null;

  return (
    <div className="ov-countdown">
      <span className="ov-countdown__value">{formatted}</span>
    </div>
  );
}
