import { useState } from "react";

import OverlayTicker from "$lib/components/overlay/overlay-ticker";
import { useAlerts } from "$lib/features/alerts/hooks/use-alerts";

type Props = {
  x: number;
  y: number;
  width: number;
};

export default function LiveTicker({ x, y, width }: Props) {
  const [text, setText] = useState<string>();

  useAlerts((data) => {
    setText(data.content);
  });

  return <OverlayTicker x={x} y={y} width={width} text={text} />;
}
