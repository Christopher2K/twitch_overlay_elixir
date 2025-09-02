interface IntegrationStatusProps {
  isConnected?: boolean;
}

export default function IntegrationStatus({ isConnected = false }: IntegrationStatusProps) {
  return (
    <div
      className={`flex w-fit flex-row items-center justify-start rounded-md p-1 text-xs text-white ${
        isConnected ? "bg-emerald-500" : "bg-rose-500"
      }`}
    >
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );
}