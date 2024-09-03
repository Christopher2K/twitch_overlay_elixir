<script lang="ts">
  import Button from "$lib/components/button.svelte";
  import Field from "$lib/components/field.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Form from "$lib/components/form.svelte";

  export let banner: string = "";
  export let title: string = "";

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(banner, title);
  }
</script>

<section class="w-full">
  <h3 class="text-2xl">Globlal informations</h3>
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
