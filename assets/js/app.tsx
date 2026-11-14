import { createInertiaApp } from "@inertiajs/react";

import AdminLayout from "./pages/admin/_layout";

// Admin pages keep the shared navigation; the login page stands alone.
function layoutFor(name: string) {
  return name.startsWith("admin") && name !== "admin/login"
    ? AdminLayout
    : undefined;
}

createInertiaApp({
  resolve: (name: string) => import(`./pages/${name}.tsx`),
  layout: (name: string) => layoutFor(name),
  http: { xsrfHeaderName: "x-csrf-token" },
});
