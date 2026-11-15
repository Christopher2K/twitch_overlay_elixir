import { useEffect, useRef, useState } from "react";

import OverlayAlert from "$lib/components/overlay/overlay-alert";
import { useAlerts } from "$lib/features/alerts/hooks/use-alerts";
import type { NotificationData } from "$lib/features/notification";

type Alert = {
  id: string;
  kind: string;
  header: string;
  content: string;
  time: string;
};

type Props = {
  variant?: "landscape" | "vertical";
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function clock() {
  const date = new Date();
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function kindFor(header: string) {
  const value = header.toLowerCase();
  if (value.includes("raid")) return ">";
  if (value.includes("sub") || value.includes("bits")) return "$";
  return "+";
}

export default function Alerts({ variant = "landscape" }: Props) {
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useAlerts((data) => {
    const notification = data as NotificationData;

    // Play audio -- This only works in OBS.
    if (notification.sound) {
      try {
        const audio = new Audio(`/sounds/${notification.sound}.mp3`);
        audio.volume = 1;
        audio.load();
        audio.play();
      } catch (_error) {
        // Audio is a best-effort enhancement.
      }
    }

    const alert: Alert = {
      id: notification.id,
      kind: kindFor(notification.header),
      header: notification.header,
      content: notification.content,
      time: clock(),
    };

    setNotifications((current) => [...current, alert].slice(-3));

    timers.current.push(
      setTimeout(() => {
        setNotifications((current) =>
          current.filter(({ id }) => id !== alert.id),
        );
      }, 5000),
    );
  });

  useEffect(() => {
    const pending = timers.current;

    return () => {
      for (const timer of pending) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={
        variant === "vertical" ? "ov-root ov-root--vertical" : "ov-root"
      }
    >
      <div className="ov-alert-stack" style={{ left: 48, top: 48 }}>
        {notifications.map((notification) => (
          <OverlayAlert
            key={notification.id}
            kind={notification.kind}
            header={notification.header}
            content={notification.content}
            time={notification.time}
          />
        ))}
      </div>
    </div>
  );
}
