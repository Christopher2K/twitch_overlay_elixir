<script lang="ts">
  export let kind: string;
  export let header: string;
  export let content: string;
  export let time: string;
</script>

<div class="ov-alert">
  <span class="ov-alert__mark">{kind}</span>
  <span class="ov-alert__header">{header}</span>
  <span class="ov-alert__content">{content}</span>
  <span class="ov-alert__time">{time}</span>
</div>
