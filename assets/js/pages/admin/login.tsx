import { router } from "@inertiajs/react";
import { useState, FormEvent } from "react";

import Field from "../../lib/components/field";
import Button from "../../lib/components/button";
import TextInput from "../../lib/components/textinput";
import Alert from "../../lib/components/alert";

interface LoginProps {
  flash?: Record<string, string>;
}

export default function Login({ flash = {} }: LoginProps) {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const error = flash["error"];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    router.post("/admin/login", formValues);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">Login</h1>

      {error && <Alert kind="error" message={error} />}

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[500px] flex-col gap-4"
      >
        <Field label="Username" htmlFor="username">
          <TextInput
            id="username"
            value={formValues.username}
            onChange={(e) =>
              setFormValues({ ...formValues, username: e.target.value })
            }
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <TextInput
            id="password"
            type="password"
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
          />
        </Field>

        <Button type="submit" fullWidth>
          Login
        </Button>
      </form>
    </div>
  );
}