<script lang="ts">
  import Counter from "$lib/components/counter.svelte";
  import TransitionScreenLayout from "$lib/components/transition-screen-layout.svelte";
</script>

<TransitionScreenLayout>
  <div class="flex h-fit flex-col items-center justify-center gap-4">
    <p class="text-one text-white">Starting soon</p>
    <Counter countdownSeconds={60 * 5}>
      <p class="text-six text-white">[Ok, peut-être en retard 🥸]</p>
    </Counter>
  </div>
</TransitionScreenLayout>
