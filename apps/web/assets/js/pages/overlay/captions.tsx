import OverlayCaptions from "$lib/components/overlay/overlay-captions";
import { useCaptions } from "$lib/features/captions/hooks/use-captions";

export default function Captions() {
  const { caption, fading } = useCaptions();

  return (
    <div className="ov-root">
      <OverlayCaptions caption={caption} fading={fading} />
    </div>
  );
}
