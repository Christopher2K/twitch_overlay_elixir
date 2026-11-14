import { useEffect, useRef } from "react";
import { Socket } from "phoenix";
import type { Metadata } from "$lib/features/metadata";

export function useConfigurationUpdate(
  onMetadataUpdate?: (data: Metadata[number]) => void,
) {
  const callback = useRef(onMetadataUpdate);
  callback.current = onMetadataUpdate;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = new Socket("/socket/events");
    const channel = socket.channel("overlay_room:lobby");

    channel.on("update_metadata", (data) => {
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
