import { InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  type?: "password" | "text";
  value?: string;
}

const classes =
  "block w-full rounded-lg border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

export default function TextInput({
  id,
  type = "text",
  value,
  ...props
}: TextInputProps) {
  return (
    <input
      id={id}
      type={type}
      className={classes}
      value={value}
      {...props}
    />
  );
}