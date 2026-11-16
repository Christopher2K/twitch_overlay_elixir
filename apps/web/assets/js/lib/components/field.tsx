import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

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

type Props = {
  label: string;
  htmlFor: string;
  inline?: boolean;
  children?: ReactNode;
};

export default function Field({
  label,
  htmlFor,
  inline = false,
  children,
}: Props) {
  return (
    <div className={containerClass({ inline })}>
      <label className="text-sm font-semibold text-zinc-800" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
