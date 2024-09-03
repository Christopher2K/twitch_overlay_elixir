<script lang="ts">
  import { router } from "@inertiajs/svelte";

  import Button from "$lib/components/button.svelte";
  import Field from "$lib/components/field.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Form from "$lib/components/form.svelte";
  import type { GlobalMetadata } from "$lib/features/metadata";

  export let initialData: GlobalMetadata["data"];

  let banner: string = initialData.banner;
  let title: string = initialData.title;

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    router.post("/admin", {
      global: {
        banner,
        title,
      },
    });
  }
</script>

<section class="w-full">
  <h3 class="text-2xl">Global informations</h3>
  <Form on:submit={handleSubmit}>
    <Field label="Banner" htmlFor="banner">
      <Textinput id="banner" bind:value={banner} />
    </Field>

    <Field label="Stream title" htmlFor="title">
      <Textinput id="title" bind:value={title} />
    </Field>
    <Button type="submit" fullWidth>Save</Button>
  </Form>
</section>
