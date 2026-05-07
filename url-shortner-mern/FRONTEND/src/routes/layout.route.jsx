import { createRoute, Outlet } from "@tanstack/react-router"
import { rootRoute } from "./root.route"
import Layout from "@/components/layout/Layout"

export const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})
