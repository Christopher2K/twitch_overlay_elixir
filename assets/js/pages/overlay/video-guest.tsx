import OverlayRegion from "$lib/components/overlay/overlay-region";
import OverlayTag from "$lib/components/overlay/overlay-tag";
import {
  type GuestOverlayProps,
  useGuestOverlayData,
} from "$lib/features/configuration/hooks/use-guest-overlay-data";

export default function VideoGuest(props: GuestOverlayProps) {
  const { participants } = useGuestOverlayData(props);
  const feeds = [
    {
      name: "llcoolchris",
      role: "software engineer",
      label: "host",
      onAir: true,
    },
    ...participants.map((participant, index) => ({
      name: participant.name,
      role: participant.description,
      label: `guest ${String(index + 1).padStart(2, "0")}`,
      onAir: false,
    })),
  ];
  const feedWidth = (1888 - 16 * (feeds.length - 1)) / feeds.length;
  const tagWidth = Math.min(320, feedWidth - 40);

  return (
    <div className="ov-root">
      {feeds.map((feed, index) => (
        <OverlayRegion
          key={`${feed.name}-${index}`}
          x={16 + index * (feedWidth + 16)}
          y={16}
          width={feedWidth}
          height={1048}
          label={feed.label}
          labelX={20}
          labelY={20}
        >
          {feed.onAir ? (
            <span className="ov-onair" style={{ right: 20, top: 20 }}>
              on air
            </span>
          ) : null}

          <OverlayTag
            x={20}
            y={976}
            width={tagWidth}
            name={feed.name}
            role={feed.role}
          />
        </OverlayRegion>
      ))}
    </div>
  );
}
