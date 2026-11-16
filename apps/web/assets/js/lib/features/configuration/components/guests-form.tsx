import { router } from "@inertiajs/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

import Button from "$lib/components/button";
import Field from "$lib/components/field";
import Form from "$lib/components/form";
import Textinput from "$lib/components/textinput";
import type { GuestMetadata, Participant } from "$lib/features/metadata";

type Props = {
  initialData: GuestMetadata["data"];
};

export default function GuestsForm({ initialData }: Props) {
  const [guests, setGuests] = useState<Participant[]>([...initialData.members]);

  function addGuestField() {
    setGuests([...guests, { name: "", description: "" }]);
  }

  function removeGuestField() {
    if (guests.length == 0) return;
    setGuests(guests.slice(0, -1));
  }

  function updateGuest(index: number, patch: Partial<Participant>) {
    setGuests(
      guests.map((guest, i) => (i === index ? { ...guest, ...patch } : guest)),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.post("/admin", {
      guests: {
        members: guests,
      },
    });
  }

  return (
    <section className="w-full">
      <h3 className="text-2xl">Guests configuration</h3>
      <Form onSubmit={handleSubmit}>
        {guests.map((guest, i) => (
          <div key={i} className="flex w-full flex-col gap-2">
            <h4 className="text-xl">Guest {i + 1}</h4>
            <Field label="Guest name" htmlFor={`guest-name-${i}`}>
              <Textinput
                id={`guest-name-${i}`}
                value={guest.name}
                onChange={(name) => updateGuest(i, { name })}
              />
            </Field>

            <Field label="Guest description" htmlFor={`guest-description-${i}`}>
              <Textinput
                id={`guest-description-${i}`}
                value={guest.description}
                onChange={(description) => updateGuest(i, { description })}
              />
            </Field>
          </div>
        ))}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <Button type="button" onClick={addGuestField} size="sm">
            Add
            <PlusIcon size={16} />
          </Button>
          <Button type="button" onClick={removeGuestField} size="sm">
            Remove
            <MinusIcon size={16} />
          </Button>
        </div>
        <Button type="submit" fullWidth>
          Save
        </Button>
      </Form>
    </section>
  );
}
