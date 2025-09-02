import { Link } from "@inertiajs/react";
import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariantProps = VariantProps<typeof buttonClasses>;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLink?: boolean;
  href?: string;
  fullWidth?: ButtonVariantProps["fullWidth"];
  size?: ButtonVariantProps["size"];
  children: ReactNode;
}

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

export default function Button({
  type = "button",
  disabled = false,
  isLink = false,
  href,
  fullWidth = false,
  size = "md",
  children,
  onClick,
  ...props
}: ButtonProps) {
  const className = buttonClasses({ fullWidth, size });

  if (isLink && href) {
    return (
      <Link
        href={href}
        className={className}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}