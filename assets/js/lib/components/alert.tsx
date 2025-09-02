import { cva } from "class-variance-authority";
import { X } from "lucide-react";

interface AlertProps {
  kind: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

const alertClasses = cva(
  [
    "flex w-fit flex-row items-center justify-center gap-4 py-2 px-4 rounded text-sm border-2",
  ],
  {
    variants: {
      kind: {
        success: ["border-emerald-500", "text-emerald-900", "bg-emerald-100"],
        error: ["border-red-500", "text-red-900", "bg-red-100"],
        info: ["border-zinc-700", "text-zinc-900", "bg-zinc-100"],
      },
    },
    defaultVariants: {
      kind: "info",
    },
  },
);

export default function Alert({ kind, message, onClose }: AlertProps) {
  return (
    <div className={alertClasses({ kind })}>
      <p>{message}</p>
      <button type="button" onClick={onClose}>
        <X />
      </button>
    </div>
  );
}