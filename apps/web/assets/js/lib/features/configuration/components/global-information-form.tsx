import { router } from "@inertiajs/react";
import { useState, type FormEvent } from "react";

import Button from "$lib/components/button";
import Field from "$lib/components/field";
import Form from "$lib/components/form";
import Textinput from "$lib/components/textinput";
import type { GlobalMetadata } from "$lib/features/metadata";

type Props = {
  initialData: GlobalMetadata["data"];
};

export default function GlobalInformationForm({ initialData }: Props) {
  const [banner, setBanner] = useState(initialData.banner);
  const [title, setTitle] = useState(initialData.title);
  const [focusMode, setFocusMode] = useState(initialData.focusMode);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.post("/admin", {
      global: {
        banner,
        title,
        focusMode,
      },
    });
  }

  return (
    <section className="w-full">
      <h3 className="text-2xl">Global informations</h3>
      <Form onSubmit={handleSubmit}>
        <Field label="Banner" htmlFor="banner">
          <Textinput id="banner" value={banner} onChange={setBanner} />
        </Field>

        <Field label="Stream title" htmlFor="title">
          <Textinput id="title" value={title} onChange={setTitle} />
        </Field>

        <Field label="Focus mode" htmlFor="focusMode" inline>
          <input
            type="checkbox"
            checked={focusMode}
            onChange={(event) => setFocusMode(event.target.checked)}
          />
        </Field>

        <Button type="submit" fullWidth>
          Save
        </Button>
      </Form>
    </section>
  );
}
