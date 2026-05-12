import { createRoute } from "@tanstack/react-router"
import { layoutRoute } from "./layout.route"
import HomePage from "@/pages/HomePage"

export const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
})
