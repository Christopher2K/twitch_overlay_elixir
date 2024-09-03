<script lang="ts">
  import { PlusIcon, MinusIcon } from "lucide-svelte";

  import Button from "$lib/components/button.svelte";
  import Field from "$lib/components/field.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Form from "$lib/components/form.svelte";

  let guestCounts: number = 1;

  function addGuestField() {
    guestCounts += 1;
  }

  function removeGuestField() {
    if (guestCounts == 1) return;
    guestCounts -= 1;
  }
</script>

<section class="w-full">
  <h3 class="text-2xl">Guests configuration</h3>
  <Form>
    {#each Array(guestCounts) as _, i}
      <div class="w-full">
        <h4 class="text-xl">Guest {i + 1}</h4>
        <Field label="Guest name" htmlFor={`guest-name-${i}`}>
          <Textinput id={`guest-name-${i}`} />
        </Field>
      </div>
    {/each}
    <div class="flex w-full flex-row items-center justify-start gap-2">
      <Button type="button" on:click={addGuestField} size="sm">
        Add
        <PlusIcon size={16} />
      </Button>
      <Button type="button" on:click={removeGuestField} size="sm">
        Remove
        <MinusIcon size={16} />
      </Button>
    </div>
    <Button type="submit" fullWidth>Save</Button>
  </Form>
</section>
