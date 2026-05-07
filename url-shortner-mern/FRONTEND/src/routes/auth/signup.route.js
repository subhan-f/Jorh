import { createRoute } from "@tanstack/react-router"
import { rootRoute } from "../root.route"
import SignupPage from "@/pages/auth/SignupPage"

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: SignupPage,
})
