<script lang="ts">
  import { flip } from "svelte/animate";

  import Notification from "$lib/components/notification.svelte";
  import type { NotificationData } from "$lib/features/notification";
  import { useAlerts } from "$lib/features/alerts/hooks/use-alerts";

  let notifications: Array<NotificationData> = [];

  useAlerts((data) => {
    // TODO: parse data
    const parsedData = data as NotificationData;

    // Play audio -- This only works in OBS
    if (parsedData.sound) {
      try {
        const audio = new Audio(`/sounds/${parsedData.sound}.mp3`);
        audio.volume = 1;
        audio.load();
        audio.play();
      } catch (e) {}
    }

    if (notifications.length == 3) {
      const [_first, ...rest] = notifications;
      notifications = [...rest, parsedData];
    } else {
      notifications = [...notifications, parsedData];
    }

    setInterval(() => {
      notifications = notifications.filter(({ id }) => id !== parsedData.id);
    }, 5000);
  });
</script>

<div class="p-10">
  <div
    class="flex w-fit flex-col items-start justify-start gap-2 whitespace-nowrap"
  >
    {#each notifications as notification (notification.id)}
      <div animate:flip={{ duration: 500 }}>
        <Notification
          header={notification.header}
          content={notification.content}
        />
      </div>
    {/each}
  </div>
</div>
