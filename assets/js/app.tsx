import { createInertiaApp as createReactInertiaApp } from "@inertiajs/react";
import { createInertiaApp as createSvelteInertiaApp } from "@inertiajs/svelte";

import AdminLayout from "./pages/admin/_layout.svelte";

type InitialPage = {
  component: string;
} & Record<string, unknown>;

const isOverlay = (name: string) => name.startsWith("overlay/");

// Inertia v3 ships the initial page in a `<script data-page>` tag.
function readInitialPage(): InitialPage {
  const script = document.querySelector<HTMLScriptElement>(
    'script[data-page="app"]',
  );
  const raw = script?.textContent;

  return raw ? JSON.parse(raw) : { component: "" };
}

const initialPage = readInitialPage();
const http = { xsrfHeaderName: "x-csrf-token" };

if (isOverlay(initialPage.component)) {
  // Overlays are React pages.
  createReactInertiaApp({
    page: initialPage as any,
    resolve: (name: string) => import(`./pages/${name}.tsx`),
    http,
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
    http,
  });
}
