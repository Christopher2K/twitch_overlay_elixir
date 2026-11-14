import { useEffect, useRef } from "react";
import { Socket } from "phoenix";
import type { NotificationData } from "$lib/features/notification";

export function useAlerts(onNewAlert?: (data: NotificationData) => void) {
  const callback = useRef(onNewAlert);
  callback.current = onNewAlert;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = new Socket("/socket/events");
    const channel = socket.channel("alerts_room:lobby");

    channel.on("alert", (data) => {
      callback.current?.(data);
    });

    socket.connect();
    channel.join();

    return () => {
      channel.leave();
      socket.disconnect();
    };
  }, []);
}
