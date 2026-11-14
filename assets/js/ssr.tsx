import type { ReactNode } from "react";
import { createInertiaApp as createReactInertiaApp } from "@inertiajs/react";
import { createInertiaApp as createSvelteInertiaApp } from "@inertiajs/svelte";
import { renderToString } from "react-dom/server";
import { render as renderSvelte } from "svelte/server";

import AdminLayout from "./pages/admin/_layout.svelte";

type InitialPage = {
  component: string;
} & Record<string, unknown>;

const isOverlay = (name: string) => name.startsWith("overlay/");

export function render(page: InitialPage) {
  if (isOverlay(page.component)) {
    // Overlays are React pages.
    return createReactInertiaApp({
      page: page as any,
      resolve: (name: string) => import(`./pages/${name}.tsx`),
      setup({ App, props }: { App: any; props: any }) {
        return <App {...props} />;
      },
      render: (element: ReactNode) => renderToString(element),
    });
  }

  // The admin stays on Svelte.
  return createSvelteInertiaApp({
    page: page as any,
    resolve: async (name: string) => {
      const page = await import(`./pages/${name}.svelte`);

      return {
        default: page.default,
        layout:
          name.startsWith("admin") && name !== "admin/login"
            ? AdminLayout
            : undefined,
      };
    },
    setup({ App, props }: { App: any; props: any }) {
      return renderSvelte(App, { props });
    },
  });
}
