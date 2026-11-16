import type { CaptionPayload } from "./api";

const MAX_SEGMENT_LENGTH = 500;

function boundedText(text: string) {
  return text.trim().slice(-MAX_SEGMENT_LENGTH);
}

/** Keep only the latest sentence-sized pieces instead of the whole transcript. */
export function captionWindow(
  finalText: string,
  partialText: string,
): CaptionPayload {
  const finalized = (finalText.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) ?? [])
    .map(boundedText)
    .filter(Boolean)
    .slice(-2);

  return { finalized, partial: boundedText(partialText) };
}
