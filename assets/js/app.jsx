import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import AdminLayout from "./pages/admin/_layout";

axios.defaults.xsrfHeaderName = "x-csrf-token";

console.log(axios.defaults)

createInertiaApp({
  resolve: async (name) => {
    const page = await import(`./pages/${name}.tsx`);
    page.default.layout = name.startsWith("admin") && name !== "admin/login"
        ? (page) => <AdminLayout>{page}</AdminLayout>
        : page.default.layout

      return page;
  },
  setup({ el, App, props }) {
    const root = createRoot(el);
    root.render(<App {...props} />);
  },
});
