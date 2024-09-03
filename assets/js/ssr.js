// @ts-nocheck
import { createInertiaApp } from "@inertiajs/svelte";

import AdminLayout from "./pages/admin/_layout.svelte";

export function render(page) {
  return createInertiaApp({
    page,
    resolve: async (name) => {
      const page = await import(`./pages/${name}.svelte`);
      return {
        default: page.default,
        layout:
          name.startsWith("admin") && name !== "admin/login"
            ? AdminLayout
            : undefined,
      };
    },
    setup({ el, App }) {
      new App({ target: el, hydrate: true });
    },
  });
}
