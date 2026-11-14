import { router, usePage } from "@inertiajs/react";
import { useState, type FormEvent } from "react";

import Alert from "$lib/components/alert";
import Button from "$lib/components/button";
import Field from "$lib/components/field";
import Textinput from "$lib/components/textinput";

type Flash = Record<string, string>;

export default function Login() {
  // Inertia keeps flash at the top level of the page object.
  const page = usePage();
  const flash = (page.flash ?? {}) as Flash;

  // Hide the old error as soon as the user submits again; a new page (and
  // therefore a new flash object) brings the alert back if login fails.
  const [dismissed, setDismissed] = useState<Flash | undefined>(undefined);
  const error = flash === dismissed ? undefined : flash["error"];

  const [formValues, setFormValues] = useState({ username: "", password: "" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDismissed(flash);
    router.post("/admin/login", formValues);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Login</h1>

      {error ? (
        <Alert
          kind="error"
          message={error}
          onClose={() => setDismissed(flash)}
        />
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[500px] flex-col gap-4"
      >
        <Field label="Username" htmlFor="username">
          <Textinput
            id="username"
            value={formValues.username}
            onChange={(username) => setFormValues({ ...formValues, username })}
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <Textinput
            id="password"
            type="password"
            value={formValues.password}
            onChange={(password) => setFormValues({ ...formValues, password })}
          />
        </Field>

        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </div>
  );
}
