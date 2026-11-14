<script lang="ts">
  import { onDestroy } from "svelte";

  import OverlayAlert from "$lib/components/overlay/overlay-alert.svelte";
  import type { NotificationData } from "$lib/features/notification";
  import { useAlerts } from "$lib/features/alerts/hooks/use-alerts";

  type Alert = {
    id: string;
    kind: string;
    header: string;
    content: string;
    time: string;
  };

  let notifications: Alert[] = [];
  const timers: Array<ReturnType<typeof setTimeout>> = [];

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

    notifications = [...notifications, alert].slice(-3);

    timers.push(
      setTimeout(() => {
        notifications = notifications.filter(({ id }) => id !== alert.id);
      }, 5000),
    );
  });

  onDestroy(() => {
    for (const timer of timers) clearTimeout(timer);
  });
</script>

<div class="ov-root">
  <div class="ov-alert-stack" style="left:48px;top:48px">
    {#each notifications as notification (notification.id)}
      <OverlayAlert
        kind={notification.kind}
        header={notification.header}
        content={notification.content}
        time={notification.time}
      />
    {/each}
  </div>
</div>
