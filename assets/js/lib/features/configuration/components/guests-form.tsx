import { router } from "@inertiajs/react";
import { Plus, Minus } from "lucide-react";
import { useState, FormEvent } from "react";

import type { GuestMetadata, Participant } from "../../metadata";
import Button from "../../../components/button";
import Field from "../../../components/field";
import TextInput from "../../../components/textinput";
import Form from "../../../components/form";

interface GuestsFormProps {
  initialData: GuestMetadata["data"];
}

export default function GuestsForm({ initialData }: GuestsFormProps) {
  const [guests, setGuests] = useState<Participant[]>([...initialData.members]);

  function addGuestField() {
    setGuests([...guests, { name: "", description: "" }]);
  }

  function removeGuestField() {
    if (guests.length === 0) return;
    setGuests(guests.slice(0, -1));
  }

  function updateGuest(index: number, field: keyof Participant, value: string) {
    const updatedGuests = [...guests];
    updatedGuests[index] = { ...updatedGuests[index], [field]: value };
    setGuests(updatedGuests);
  }

  function handleSubmit(event: FormEvent) {
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
              <TextInput
                id={`guest-name-${i}`}
                value={guest.name}
                onChange={(e) => updateGuest(i, "name", e.target.value)}
              />
            </Field>

            <Field label="Guest description" htmlFor={`guest-description-${i}`}>
              <TextInput
                id={`guest-description-${i}`}
                value={guest.description}
                onChange={(e) => updateGuest(i, "description", e.target.value)}
              />
            </Field>
          </div>
        ))}
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <Button type="button" onClick={addGuestField} size="sm">
            Add
            <Plus size={16} />
          </Button>
          <Button type="button" onClick={removeGuestField} size="sm">
            Remove
            <Minus size={16} />
          </Button>
        </div>
        <Button type="submit" fullWidth>Save</Button>
      </Form>
    </section>
  );
}