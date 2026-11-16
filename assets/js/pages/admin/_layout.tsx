import { Link, usePage } from "@inertiajs/react";
import { useState, type ReactNode } from "react";

import Alert from "$lib/components/alert";
import Button from "$lib/components/button";

type Flash = Record<string, string>;

type Props = {
  children?: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  // Inertia keeps flash at the top level of the page object.
  const page = usePage();
  const flash = (page.flash ?? {}) as Flash;

  // Compare by identity: a new page (and therefore a new flash object) brings
  // the alert back after it was dismissed.
  const [dismissed, setDismissed] = useState<Flash | undefined>(undefined);

  function onAlertClose() {
    setDismissed(flash);
  }

  return (
    <>
      <nav className="static top-0 w-full">
        <div className="relative flex h-16 w-full flex-row items-center justify-between border-b px-4">
          <div>
            <h1>Overlays control panel</h1>
          </div>

          <div className="flex flex-row items-center justify-end gap-4">
            <Link href="/admin" className="hover:underline">
              Configuration
            </Link>
            <Link href="/admin/integrations" className="hover:underline">
              Integrations
            </Link>
            <Link href="/admin/captions" className="hover:underline">
              Captions
            </Link>
            <Button isLink href="/admin/logout">
              Logout
            </Button>
          </div>

          {Object.keys(flash).length > 0 && flash !== dismissed ? (
            <div className="absolute -bottom-0 left-1/2 z-50 -translate-x-1/2 translate-y-[100%] p-4">
              {flash.success ? (
                <Alert
                  kind="success"
                  message={flash.success}
                  onClose={onAlertClose}
                />
              ) : flash.error ? (
                <Alert
                  kind="error"
                  message={flash.error}
                  onClose={onAlertClose}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>

      {children}
    </>
  );
}
