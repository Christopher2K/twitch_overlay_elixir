<script lang="ts">
  import LongLogo from "$lib/icons/long-logo.svelte";
  import SocialMedia from "$lib/components/social-media.svelte";
</script>

<div
  class="border-dekstop-light flex h-full w-full flex-col items-center justify-between rounded-lg border-[0.6rem] p-3"
>
  <div
    class="mt-20 flex w-full flex-1 flex-col items-center justify-center gap-10"
  >
    <header class="w-[60%]">
      <LongLogo class="h-auto w-full" />
    </header>

    <slot />
  </div>

  <footer class="h-fit w-full">
    <div class="mx-auto w-fit">
      <SocialMedia />
    </div>
  </footer>
</div>
