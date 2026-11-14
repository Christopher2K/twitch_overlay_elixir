import { router } from "@inertiajs/react";
import { useState } from "react";

import Button from "$lib/components/button";
import IntegrationStatus from "$lib/components/integration-status";
import type {
  AvailableSubscriptionType,
  Subscription,
} from "$lib/features/subscription";

type Props = {
  integrations?: string[];
  subscriptions?: Subscription[];
  twitch_sub_types?: AvailableSubscriptionType[];
};

export default function Integrations({
  integrations = [],
  subscriptions = [],
  twitch_sub_types = [],
}: Props) {
  const [loading, setLoading] = useState(false);

  const isTwitchConnected = integrations.includes("twitch");
  const twitchSubscriptions = subscriptions.filter(
    (sub) => sub.platform === "twitch",
  );

  // There's obviously better ways to do this. Idc right now
  function isSubscribed(type: string) {
    return twitchSubscriptions.some((sub) => sub.type === type);
  }

  // Just one integration platform for now
  async function subscribeToEvent(type: string, platform: string = "twitch") {
    setLoading(true);

    await router.post("/admin/integrations/subscribe", {
      platform,
      type,
    });

    setLoading(false);
  }

  async function unsubscribeToEvent(type: string, platform: string = "twitch") {
    const subscription = subscriptions.find(
      (sub) => sub.type === type && sub.platform === platform,
    );
    if (!subscription) return;

    setLoading(true);

    await router.delete("/admin/integrations/unsubscribe/" + subscription.id);

    setLoading(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start justify-start gap-4 px-4 py-10">
      <h2 className="text-3xl">Integrations</h2>

      <section className="flex w-full flex-col gap-4">
        <div className="flex-start flex w-full flex-row items-center gap-4">
          <h3 className="text-2xl underline">Twitch</h3>
          <IntegrationStatus isConnected={isTwitchConnected} />
        </div>

        {!isTwitchConnected ? (
          <Button
            size="sm"
            isLink
            href="/admin/integrations/twitch"
            disabled={isTwitchConnected}
          >
            Login with Twitch
          </Button>
        ) : null}

        <div className="w-full">
          <h4 className="mb-4 text-xl text-gray-600">Event subscriptions</h4>
          <div>
            {twitch_sub_types.length === 0 ? (
              <p>No subscription type available for this integration</p>
            ) : (
              twitch_sub_types.map((subType, i) => (
                <div
                  key={subType.type}
                  className={`px-2 py-4 ${i % 2 == 0 ? "bg-gray-100" : "bg-gray-50"} flex flex-row items-center justify-between`}
                >
                  <p>
                    {subType.name} ({subType.type})
                  </p>
                  <div className="flex w-fit flex-row items-center justify-end gap-4">
                    <Button
                      disabled={isSubscribed(subType.type) || loading}
                      type="button"
                      onClick={() => subscribeToEvent(subType.type, "twitch")}
                    >
                      Subscribe
                    </Button>

                    <Button
                      type="button"
                      disabled={!isSubscribed(subType.type) || loading}
                      onClick={() => unsubscribeToEvent(subType.type, "twitch")}
                    >
                      Unsubscribe
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
