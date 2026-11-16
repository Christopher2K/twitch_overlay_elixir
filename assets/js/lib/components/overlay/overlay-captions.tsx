import type { CaptionPayload } from "$lib/features/captions/api";

type Props = {
  caption: CaptionPayload;
  fading: boolean;
};

export default function OverlayCaptions({ caption, fading }: Props) {
  if (!caption.partial && caption.finalized.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-24">
      <div
        className={`max-w-[1200px] rounded-lg bg-black/80 px-8 py-5 text-center shadow-2xl transition-opacity duration-500 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {caption.finalized.map((text, index) => (
          <p
            key={`${index}-${text}`}
            className="text-[30px] font-medium leading-snug text-white/75"
          >
            {text}
          </p>
        ))}
        {caption.partial ? (
          <p className="text-[36px] font-semibold leading-snug text-white">
            {caption.partial}
          </p>
        ) : null}
      </div>
    </div>
  );
}
