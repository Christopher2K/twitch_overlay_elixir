<script lang="ts">
  export let variant: "landscape" | "vertical" = "landscape";
  export let status: string;
  export let focus = false;
</script>

<div
  class="ov-stage"
  class:ov-stage--vertical={variant === "vertical"}
  class:ov-stage--focus={focus}
  style={variant === "vertical"
    ? "left:16px;top:16px;width:1048px;height:1888px"
    : "left:16px;top:16px;width:1888px;height:1048px"}
>
  <span class="ov-stage__corner ov-stage__corner--left ov-stage__corner--top">
    llcoolchris // live
  </span>
  <span class="ov-stage__corner ov-stage__corner--right ov-stage__corner--top">
    {status}
  </span>
  <span
    class="ov-stage__corner ov-stage__corner--left ov-stage__corner--bottom"
  >
    llcoolchris // twitch.tv
  </span>
  <span
    class="ov-stage__corner ov-stage__corner--right ov-stage__corner--bottom"
  >
    [discord] to join
  </span>

  <div class="ov-stage__center">
    <slot />
  </div>
</div>
