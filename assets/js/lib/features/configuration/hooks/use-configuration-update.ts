import { onDestroy, onMount } from "svelte";
import type { Metadata } from "$lib/features/metadata";
import { Socket, Channel } from "phoenix";

export function useConfigurationUpdate(
  onMetadataUpdate?: (data: Metadata[number]) => void,
) {
  let socket: Socket;
  let channel: Channel;

  onMount(() => {
    if (typeof window === "undefined") return;

    socket = new Socket("/socket/events");
    channel = socket.channel("overlay_room:lobby");
    channel.on("update_metadata", (data) => {
      onMetadataUpdate?.(data);
    });

    socket.connect();
    channel.join();
  });

  onDestroy(() => {
    socket?.disconnect();
    channel?.leave();
  });
}
