<script lang="ts">
  type AudioParticipant = {
    name: string;
    role: string;
    onAir?: boolean;
  };

  export let x: number;
  export let y: number;
  export let width = 340;
  export let participants: AudioParticipant[] = [];
</script>

{#if participants.length > 0}
  <div class="ov-audio-stack" style={`left:${x}px;top:${y}px;width:${width}px`}>
    {#each participants as participant}
      <div class="ov-audio-row">
        <span
          class="ov-audio-row__mark"
          class:ov-audio-row__mark--on={participant.onAir}
        ></span>
        <span class="ov-audio-row__identity">
          <span class="ov-audio-row__name">{participant.name}</span>
          <span class="ov-audio-row__role">{participant.role}</span>
        </span>
      </div>
    {/each}
  </div>
{/if}
