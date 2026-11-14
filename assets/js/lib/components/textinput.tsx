import type { ChangeEvent } from "react";

const classes =
  "block w-full rounded-lg border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

type Props = {
  id: string;
  type?: "password" | "text";
  value: string;
  onChange: (value: string) => void;
};

export default function Textinput({
  id,
  type = "text",
  value,
  onChange,
}: Props) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <input
      id={id}
      type={type}
      className={classes}
      value={value}
      onChange={handleChange}
    />
  );
}
