import { useEffect, useState } from "react";

export type MicrophoneDevice = {
  deviceId: string;
  label: string;
};

export function useMicrophoneDevices(refreshKey: unknown) {
  const [devices, setDevices] = useState<MicrophoneDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    let mounted = true;

    const refresh = async () => {
      try {
        const available = await navigator.mediaDevices.enumerateDevices();
        if (!mounted) return;

        const microphones = available
          .filter((device) => device.kind === "audioinput")
          .map((device, index) => ({
            deviceId: device.deviceId,
            label: device.label || `Microphone ${index + 1}`,
          }));

        setDevices(microphones);
        setError(null);
        setSelectedDeviceId((selected) =>
          selected &&
          microphones.length > 0 &&
          !microphones.some((device) => device.deviceId === selected)
            ? ""
            : selected,
        );
      } catch {
        if (mounted) setError("Could not list microphone inputs.");
      }
    };

    void refresh();
    navigator.mediaDevices.addEventListener("devicechange", refresh);

    return () => {
      mounted = false;
      navigator.mediaDevices.removeEventListener("devicechange", refresh);
    };
  }, [refreshKey]);

  return { devices, selectedDeviceId, setSelectedDeviceId, error };
}
