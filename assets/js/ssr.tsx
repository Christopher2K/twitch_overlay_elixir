import { createInertiaApp } from "@inertiajs/react";
import type { ReactElement } from "react";
import { renderToString } from "react-dom/server";

import AdminLayout from "./pages/admin/_layout";

type InitialPage = {
  component: string;
} & Record<string, unknown>;

// Admin pages keep the shared navigation; the login page stands alone.
function layoutFor(name: string) {
  return name.startsWith("admin") && name !== "admin/login"
    ? AdminLayout
    : undefined;
}

export function render(page: InitialPage) {
  return createInertiaApp({
    page: page as never,
    resolve: (name: string) => import(`./pages/${name}.tsx`),
    layout: (name: string) => layoutFor(name),
    setup({ App, props }: { App: any; props: any }): ReactElement {
      return <App {...props} />;
    },
    render: renderToString,
  });
}
