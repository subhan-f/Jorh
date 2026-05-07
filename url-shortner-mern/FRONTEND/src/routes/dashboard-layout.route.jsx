import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "./root.route"
import DashboardLayout from "@/layouts/DashboardLayout"

export const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
})
