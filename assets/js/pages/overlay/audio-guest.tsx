import OverlayAudioStack, {
  type AudioParticipant,
} from "$lib/components/overlay/overlay-audio-stack";
import OverlayBanner from "$lib/components/overlay/overlay-banner";
import OverlayRegion from "$lib/components/overlay/overlay-region";
import {
  type GuestOverlayProps,
  useGuestOverlayData,
} from "$lib/features/configuration/hooks/use-guest-overlay-data";

const HOST: AudioParticipant = {
  name: "llcoolchris",
  role: "développeur web · toronto",
  onAir: true,
};

export default function AudioGuest(props: GuestOverlayProps) {
  const { globalData, participants } = useGuestOverlayData(props);
  const rows: AudioParticipant[] = [
    HOST,
    ...participants.map((participant) => ({
      name: participant.name,
      role: participant.description || "en écoute",
    })),
  ];
  // Anchored to the same bottom edge as the designed three-row stack.
  const stackY = 1020 - 58 * rows.length;

  return (
    <div className="ov-root">
      <OverlayRegion
        x={16}
        y={16}
        width={1888}
        height={1048}
        label="frame"
        labelX={32}
        labelY={30}
      >
        <OverlayBanner
          x={32}
          y={936}
          width={780}
          title={globalData?.data.title}
          tag={globalData?.data.banner}
        />

        <OverlayAudioStack
          x={1516}
          y={stackY}
          width={340}
          participants={rows}
        />
      </OverlayRegion>
    </div>
  );
}
