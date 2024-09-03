// @ts-nocheck
import { createInertiaApp } from "@inertiajs/svelte";
import axios from "axios";

import AdminLayout from "./pages/admin/_layout.svelte";

axios.defaults.xsrfHeaderName = "x-csrf-token";

createInertiaApp({
  page: undefined, // This undefined prop is to avoid TS errors
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
