import { createInertiaApp as createReactInertiaApp } from "@inertiajs/react";
import { createInertiaApp as createSvelteInertiaApp } from "@inertiajs/svelte";
import axios from "axios";
import { createRoot, hydrateRoot } from "react-dom/client";

import AdminLayout from "./pages/admin/_layout.svelte";

axios.defaults.xsrfHeaderName = "x-csrf-token";

type InitialPage = {
  component: string;
} & Record<string, unknown>;

const isOverlay = (name: string) => name.startsWith("overlay/");

const el = document.getElementById("app");
const initialPage = JSON.parse(el?.dataset.page ?? "{}") as InitialPage;

if (isOverlay(initialPage.component)) {
  // Overlays are React pages.
  createReactInertiaApp({
    page: initialPage as any,
    resolve: (name: string) => import(`./pages/${name}.tsx`),
    setup({ el, App, props }) {
      if (el.hasChildNodes()) {
        hydrateRoot(el, <App {...props} />);
      } else {
        createRoot(el).render(<App {...props} />);
      }
    },
  });
} else {
  // The admin stays on Svelte.
  createSvelteInertiaApp({
    page: initialPage as any,
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
    setup({ el, App }: { el: HTMLElement; App: any }) {
      new App({ target: el, hydrate: true });
    },
  });
}
