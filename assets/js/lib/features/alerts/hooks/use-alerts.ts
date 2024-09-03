import { onDestroy, onMount } from "svelte";
import { Socket, Channel } from "phoenix";
import type { NotificationData } from "$lib/features/notification";

export function useAlerts(onNewAlert?: (data: NotificationData) => void) {
  let socket: Socket;
  let channel: Channel;

  onMount(() => {
    if (typeof window === "undefined") return;

    socket = new Socket("/socket/events");
    channel = socket.channel("alerts_room:lobby");
    channel.on("alert", (data) => {
      onNewAlert?.(data);
    });

    socket.connect();
    channel.join();
  });

  onDestroy(() => {
    socket?.disconnect();
    channel?.leave();
  });
}
