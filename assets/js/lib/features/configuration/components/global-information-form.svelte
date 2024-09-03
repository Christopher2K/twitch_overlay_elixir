<script>
  import Button from "$lib/components/button.svelte";
  import Field from "$lib/components/field.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Form from "$lib/components/form.svelte";
</script>

<section class="w-full">
  <h3 class="text-2xl">Globlal informations</h3>
  <Form>
    <Field label="Banner" htmlFor="banner">
      <Textinput id="banner" />
    </Field>

    <Field label="Stream title" htmlFor="title">
      <Textinput id="title" />
    </Field>
    <Button type="submit" fullWidth>Save</Button>
  </Form>
</section>
