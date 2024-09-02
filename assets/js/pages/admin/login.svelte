<script lang="ts">
  import { router } from "@inertiajs/svelte";

  import Field from "$lib/components/field.svelte";
  import Button from "$lib/components/button.svelte";
  import Textinput from "$lib/components/textinput.svelte";
  import Alert from "$lib/components/alert.svelte";

  export let flash: Record<string, string> = {};
  $: error = flash["error"];

  const formValues = {
    username: "",
    password: "",
  };

  function handleSubmit() {
    flash = {};
    console.log(formValues);
    router.post("/admin/login", formValues);
  }
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
  <h1 class="text-2xl">Login</h1>

  {#if error}
    <Alert kind="error" message={error} />
  {/if}

  <form
    on:submit|preventDefault={handleSubmit}
    class="flex w-full max-w-[500px] flex-col gap-4"
  >
    <Field label="Username" htmlFor="username">
      <Textinput id="username" bind:value={formValues.username} />
    </Field>

    <Field label="Password" htmlFor="password">
      <Textinput
        id="password"
        type="password"
        bind:value={formValues.password}
      />
    </Field>

    <Button type="submit">Login</Button>
  </form>
</div>
