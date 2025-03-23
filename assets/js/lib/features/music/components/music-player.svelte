<script lang="ts">
  import { useCiderMusic } from "$lib/features/music/hooks/use-cider-music";
  import clsx from "clsx";

  const { music } = useCiderMusic();
</script>

{#if $music.name}
  <div
    class={clsx(
      "card flex w-fit flex-row items-start justify-start gap-2 bg-desktop p-2",
    )}
  >
    <div>
      <img
        src={$music.artwork}
        alt="Music Artwork"
        class="h-16 w-16 rounded-md object-cover"
      />
    </div>
    <div>
      <p class="text-nine text-ellipsis text-white">
        {$music.name}
      </p>

      <p class="text-nine text-ellipsis text-white">
        {$music.artist}
      </p>

      <p class="text-nine text-ellipsis text-white">
        {$music.album}
      </p>
    </div>
  </div>
{/if}
