import { router } from "@inertiajs/react";
import { useState, FormEvent } from "react";

import Button from "../../../components/button";
import Field from "../../../components/field";
import TextInput from "../../../components/textinput";
import Form from "../../../components/form";
import type { GlobalMetadata } from "../../metadata";

interface GlobalInformationFormProps {
  initialData: GlobalMetadata["data"];
}

export default function GlobalInformationForm({ initialData }: GlobalInformationFormProps) {
  const [banner, setBanner] = useState(initialData.banner);
  const [title, setTitle] = useState(initialData.title);
  const [focusMode, setFocusMode] = useState(initialData.focusMode);

  function handleSubmit(event: FormEvent) {
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
          <TextInput 
            id="banner" 
            value={banner} 
            onChange={(e) => setBanner(e.target.value)} 
          />
        </Field>

        <Field label="Stream title" htmlFor="title">
          <TextInput 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </Field>

        <Field label="Focus mode" htmlFor="focusMode" inline>
          <input 
            type="checkbox" 
            checked={focusMode} 
            onChange={(e) => setFocusMode(e.target.checked)} 
          />
        </Field>

        <Button type="submit" fullWidth>Save</Button>
      </Form>
    </section>
  );
}