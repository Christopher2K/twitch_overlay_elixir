<script>
  import Button from "$lib/components/button.svelte";
</script>

<nav
  class="static top-0 flex h-16 w-full flex-row items-center justify-between border-b px-4"
>
  <div>
    <h1>Overlays control panel</h1>
  </div>
  <div>
    <Button isLink href="/admin/logout">Logout</Button>
  </div>
</nav>

<slot />
