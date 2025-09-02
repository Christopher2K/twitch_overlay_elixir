import { useState, useEffect, ReactNode } from "react";

interface CounterProps {
  countdownSeconds: number;
  children?: ReactNode;
}

export default function Counter({ countdownSeconds: initialSeconds, children }: CounterProps) {
  const [countdownSeconds, setCountdownSeconds] = useState(initialSeconds);

  const minutes = Math.floor(countdownSeconds / 60);
  const seconds = countdownSeconds % 60;
  const formattedSeconds = `${pad(minutes)}:${pad(seconds)}`;
  const isDone = countdownSeconds <= 0;

  function pad(num: number) {
    return String(num).padStart(2, "0");
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isDone) {
    return <>{children}</>;
  }

  return (
    <div className="w-fit rounded-lg border-4 border-white px-4">
      <p className="text-four tabular-nums text-white">
        {formattedSeconds}
      </p>
    </div>
  );
}