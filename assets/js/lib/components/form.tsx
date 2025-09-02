import { FormHTMLAttributes, ReactNode } from "react";

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export default function Form({ children, ...props }: FormProps) {
  return (
    <form
      className="flex w-full flex-col items-start justify-start gap-4"
      {...props}
    >
      {children}
    </form>
  );
}