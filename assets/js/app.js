// @ts-nocheck
import { createInertiaApp } from "@inertiajs/svelte";
import axios from "axios";

axios.defaults.xsrfHeaderName = "x-csrf-token";

createInertiaApp({
  page: undefined, // This undefined prop is to avoid TS errors
  resolve: async (name) => await import(`./pages/${name}.svelte`),
  setup({ el, App }) {
    new App({ target: el, hydrate: true });
  },
});
