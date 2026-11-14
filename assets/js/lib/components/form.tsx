import clsx from "clsx";
import type { FormHTMLAttributes } from "react";

type Props = FormHTMLAttributes<HTMLFormElement>;

export default function Form({ className, ...props }: Props) {
  return (
    <form
      {...props}
      className={clsx(
        "flex w-full flex-col items-start justify-start gap-4",
        className,
      )}
    />
  );
}
