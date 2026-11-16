import { useEffect, useMemo, useState } from "react";
import {
  SonioxProvider,
  useMicrophonePermission,
  useRecording,
} from "@soniox/react";
import { MicrophoneSource } from "@soniox/client";

import Alert from "$lib/components/alert";
import Button from "$lib/components/button";
import Field from "$lib/components/field";
import {
  clearPublishedCaptions,
  getTemporarySonioxKey,
} from "$lib/features/captions/api";
import { useCaptionPublisher } from "$lib/features/captions/hooks/use-caption-publisher";
import { useMicrophoneDevices } from "$lib/features/captions/hooks/use-microphone-devices";

async function sonioxConfig() {
  const key = await getTemporarySonioxKey();
  return { api_key: key.api_key };
}

function statusLabel(state: string, publishing: boolean) {
  if (publishing && state === "recording") return "Live";
  if (state === "reconnecting") return "Reconnecting";
  if (state === "stopping") return "Stopping";
  if (state === "error") return "Error";
  if (publishing) return "Starting";
  return "Stopped";
}

function CaptionControls({ sonioxConfigured }: { sonioxConfigured: boolean }) {
  const [publishing, setPublishing] = useState(false);
  const [session, setSession] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const permission = useMicrophonePermission({ autoCheck: true });
  const microphone = useMicrophoneDevices(permission.status);
  const microphoneSource = useMemo(() => {
    if (!microphone.selectedDeviceId) return undefined;

    return new MicrophoneSource({
      constraints: {
        deviceId: { exact: microphone.selectedDeviceId },
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
        sampleRate: 16000,
      },
    });
  }, [microphone.selectedDeviceId]);

  const recording = useRecording({
    source: microphoneSource,
    model: "stt-rt-v6",
    language_hints: ["fr"],
    translation: { type: "one_way", target_language: "en" },
    enable_endpoint_detection: true,
    auto_reconnect: true,
    max_reconnect_attempts: 8,
    onFinished: () => {
      setPublishing(false);
      void clearPublishedCaptions().catch(() => undefined);
    },
  });

  const original = recording.groups.original?.text ?? "";
  const translated = recording.groups.translation?.text ?? "";
  const publisher = useCaptionPublisher(
    publishing,
    session,
    recording.groups.translation?.finalText ?? "",
    recording.groups.translation?.partialText ?? "",
  );

  useEffect(() => {
    void permission.check();
  }, [recording.state]);

  useEffect(() => {
    if (recording.state === "error" && publishing) {
      setPublishing(false);
      void clearPublishedCaptions().catch(() => undefined);
    }
  }, [recording.state, publishing]);

  function start() {
    setActionError(null);
    publisher.clearError();
    recording.clearTranscript();
    setSession((value) => value + 1);
    setPublishing(true);
    recording.start();
    void clearPublishedCaptions().catch((reason: unknown) => {
      setActionError(
        reason instanceof Error ? reason.message : "Could not clear captions.",
      );
    });
  }

  async function stop() {
    setActionError(null);
    try {
      await recording.stop();
    } catch (reason) {
      setPublishing(false);
      setActionError(
        reason instanceof Error ? reason.message : "Could not stop recording.",
      );
      await clearPublishedCaptions().catch(() => undefined);
    }
  }

  function clear() {
    recording.clearTranscript();
    setSession((value) => value + 1);
    publisher.clearError();
    setActionError(null);
    void clearPublishedCaptions().catch((reason: unknown) => {
      setActionError(
        reason instanceof Error ? reason.message : "Could not clear captions.",
      );
    });
  }

  const error =
    actionError ??
    publisher.error ??
    microphone.error ??
    recording.error?.message;
  const status = statusLabel(recording.state, publishing);

  return (
    <div className="flex w-full flex-col gap-6">
      {!sonioxConfigured ? (
        <Alert
          kind="error"
          message="Set SONIOX_API_KEY on the Phoenix server, then restart it before starting captions."
        />
      ) : null}

      {error ? <Alert kind="error" message={error} /> : null}

      <section className="card flex w-full flex-col gap-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl">French → English</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Audio goes directly from this browser to Soniox.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              status === "Live"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {status}
          </span>
        </div>

        <Field label="Microphone input" htmlFor="caption-microphone">
          <select
            id="caption-microphone"
            className="block w-full rounded-lg border-0 bg-white py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:opacity-50 sm:text-sm"
            value={microphone.selectedDeviceId}
            onChange={(event) =>
              microphone.setSelectedDeviceId(event.target.value)
            }
            disabled={recording.isActive || publishing}
          >
            <option value="">System default microphone</option>
            {microphone.devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
          {recording.isActive || publishing ? (
            <p className="text-xs text-zinc-500">
              Stop captions to change the microphone input.
            </p>
          ) : null}
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={start}
            disabled={!sonioxConfigured || recording.isActive || publishing}
          >
            Start captions
          </Button>
          <Button
            type="button"
            onClick={() => void stop()}
            disabled={!recording.isActive && !publishing}
          >
            {recording.state === "stopping" ? "Stopping…" : "Stop captions"}
          </Button>
          <Button type="button" onClick={clear}>
            Clear
          </Button>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Microphone permission</dt>
            <dd className="capitalize text-zinc-600">{permission.status}</dd>
          </div>
          <div>
            <dt className="font-semibold">Connection</dt>
            <dd className="text-zinc-600">
              {recording.isReconnecting
                ? `Reconnecting (attempt ${recording.reconnectAttempt})`
                : recording.state}
            </dd>
          </div>
        </dl>

        {!recording.isSupported ? (
          <Alert
            kind="error"
            message="Microphone capture is unavailable. Use HTTPS or localhost in a supported browser."
          />
        ) : null}
      </section>

      <section className="grid w-full gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-3 text-lg">French transcription</h3>
          <p className="min-h-32 whitespace-pre-wrap text-zinc-700">
            {original || "Recognized French speech will appear here."}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="mb-3 text-lg">English translation</h3>
          <p className="min-h-32 whitespace-pre-wrap text-zinc-700">
            {translated || "Translated English captions will appear here."}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function AdminCaptions({
  sonioxConfigured = false,
}: {
  sonioxConfigured?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-4 py-10">
      <div>
        <h2 className="text-3xl">Live translated captions</h2>
        <p className="mt-2 max-w-3xl text-zinc-600">
          Keep this page open while streaming. Add{" "}
          <a
            className="font-mono text-sm underline"
            href="/overlay/captions"
            target="_blank"
            rel="noreferrer"
          >
            /overlay/captions
          </a>{" "}
          as a transparent OBS Browser Source.
        </p>
      </div>

      <SonioxProvider config={sonioxConfig}>
        <CaptionControls sonioxConfigured={sonioxConfigured} />
      </SonioxProvider>
    </div>
  );
}
