import { createInertiaApp } from "@inertiajs/react";
import ReactDOMServer from "react-dom/server";

import AdminLayout from "./pages/admin/_layout";

export function render(page) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: async (name) => {
      const page = await import(`./pages/${name}.tsx`);

      page.default.layout =
        name.startsWith("admin") && name !== "admin/login"
          ? AdminLayout
          : page.default.layout;

      return page;
    },
    setup: ({ App, props }) => <App {...props} />
  });
}
