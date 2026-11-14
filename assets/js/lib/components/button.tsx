import { Link } from "@inertiajs/react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const buttonClasses = cva(
  "flex items-center justify-center gap-2 rounded-md border border-transparent bg-zinc-900 font-semibold text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      fullWidth: false,
      size: "md",
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonClasses>;

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  type?: "button" | "submit";
  isLink?: boolean;
  href?: string;
  fullWidth?: ButtonVariantProps["fullWidth"];
  size?: ButtonVariantProps["size"];
  children?: ReactNode;
};

export default function Button({
  type = "button",
  disabled = false,
  isLink = false,
  href,
  fullWidth = false,
  size = "md",
  className,
  children,
  ...props
}: Props) {
  const classes = clsx(buttonClasses({ fullWidth, size }), className);

  if (isLink) {
    return (
      <Link href={href ?? "#"} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
