import { cva } from "class-variance-authority";
import { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  inline?: boolean;
  children: ReactNode;
}

const containerClass = cva("flex w-full gap-2", {
  variants: {
    inline: {
      true: "flex-row items-center",
      false: "flex-col",
    },
  },
  defaultVariants: {
    inline: false,
  },
});

export default function Field({ label, htmlFor, inline = false, children }: FieldProps) {
  return (
    <div className={containerClass({ inline })}>
      <label className="text-sm font-semibold text-zinc-800" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}