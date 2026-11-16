import { router } from "@inertiajs/react";
import { useState, type FormEvent } from "react";

import Button from "$lib/components/button";
import Field from "$lib/components/field";
import Form from "$lib/components/form";
import Textinput from "$lib/components/textinput";
import type { LastfmMetadata } from "$lib/features/metadata";

type Props = {
  initialData: LastfmMetadata["data"];
};

export default function LastfmForm({ initialData }: Props) {
  const [username, setUsername] = useState(initialData.username);
  const [apiKey, setApiKey] = useState(initialData.api_key);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.post("/admin", {
      lastfm: {
        api_key: apiKey,
        username,
      },
    });
  }

  return (
    <section className="w-full">
      <h3 className="text-2xl">Last.fm</h3>
      <Form onSubmit={handleSubmit}>
        <Field label="Last.fm username" htmlFor="lastfm-username">
          <Textinput
            id="lastfm-username"
            value={username}
            onChange={setUsername}
          />
        </Field>

        <Field label="Last.fm API key" htmlFor="lastfm-api-key">
          <Textinput
            id="lastfm-api-key"
            type="password"
            value={apiKey}
            onChange={setApiKey}
          />
        </Field>

        <p className="text-sm text-gray-600">
          Used server-side to read current and recent scrobbles. Leave either
          field empty to disable Last.fm.
        </p>

        <Button type="submit" fullWidth>
          Save
        </Button>
      </Form>
    </section>
  );
}
