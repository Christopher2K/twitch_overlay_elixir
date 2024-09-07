<script lang="ts">
  import { router } from "@inertiajs/svelte";
  import { PlusIcon, MinusIcon } from "lucide-svelte";

  import type { GuestMetadata, Participant } from "$lib/features/metadata";
  import Button from "$lib/components/button.svelte";
  import Field from "$lib/components/field.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Form from "$lib/components/form.svelte";

  export let initialData: GuestMetadata["data"];

  let guests: Participant[] = [...initialData.members];

  function addGuestField() {
    guests = [...guests, { name: "", description: "" }];
  }

  function removeGuestField() {
    if (guests.length == 0) return;
    guests = guests.slice(0, -1);
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    router.post("/admin", {
      guests: {
        members: guests,
      },
    });
  }
</script>

<section class="w-full">
  <h3 class="text-2xl">Guests configuration</h3>
  <Form on:submit={handleSubmit}>
    {#each guests as guest, i}
      <div class="flex w-full flex-col gap-2">
        <h4 class="text-xl">Guest {i + 1}</h4>
        <Field label="Guest name" htmlFor={`guest-name-${i}`}>
          <Textinput id={`guest-name-${i}`} bind:value={guest.name} />
        </Field>

        <Field label="Guest description" htmlFor={`guest-description-${i}`}>
          <Textinput
            id={`guest-description-${i}`}
            bind:value={guest.description}
          />
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
