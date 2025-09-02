import { Link } from "@inertiajs/react";
import { ReactNode } from "react";
import Button from "../../lib/components/button";
import Alert from "../../lib/components/alert";

interface LayoutProps {
  children: ReactNode;
  flash?: Record<string, string>;
}

export default function AdminLayout({ children, flash = {} }: LayoutProps) {
  const handleAlertClose = () => {
    // In React, we would typically manage this through state
    // For now, we'll leave this empty as flash messages are typically
    // handled by the backend/Inertia
  };

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
            <Button isLink href="/admin/logout">
              Logout
            </Button>
          </div>

          {Object.keys(flash).length > 0 && (
            <div className="absolute -bottom-0 left-1/2 z-50 -translate-x-1/2 translate-y-[100%] p-4">
              {flash.success && (
                <Alert
                  kind="success"
                  message={flash.success}
                  onClose={handleAlertClose}
                />
              )}
              {flash.error && (
                <Alert
                  kind="error"
                  message={flash.error}
                  onClose={handleAlertClose}
                />
              )}
            </div>
          )}
        </div>
      </nav>

      {children}
    </>
  );
}