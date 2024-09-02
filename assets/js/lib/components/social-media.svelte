<script lang="ts">
  // @ts-nocheck
  import { TwitterIcon, InstagramIcon } from "lucide-svelte";

  const socialMedia = [
    {
      name: "@LLCoolChris_",
      icon: TwitterIcon,
    },
    {
      name: "@LLCoolChris_",
      icon: InstagramIcon,
    },
  ];
</script>

<div class="flex w-fit flex-row items-center justify-start gap-6">
  {#each socialMedia as socialMedia}
    <div class="flex flex-row items-center justify-start gap-2 text-white">
      <svelte:component this={socialMedia.icon} size={32} />
      <p class="text-six">{socialMedia.name}</p>
    </div>
  {/each}
</div>
