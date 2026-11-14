import { cva } from "class-variance-authority";
import { XIcon } from "lucide-react";

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

type Props = {
  kind: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
};

export default function Alert({ kind, message, onClose }: Props) {
  return (
    <div className={alertClasses({ kind })}>
      <p>{message}</p>
      <button type="button" onClick={onClose}>
        <XIcon />
      </button>
    </div>
  );
}
