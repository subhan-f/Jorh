import { rootRoute } from "./root.route"
import { layoutRoute } from "./layout.route"
import { indexRoute } from "./index.route"
import { dashboardLayoutRoute } from "./dashboard-layout.route"
import { dashboardRoute } from "./dashboard/dashboard.route"
import { loginRoute } from "./auth/login.route"
import { signupRoute } from "./auth/signup.route"

export const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([indexRoute]),
  dashboardLayoutRoute.addChildren([dashboardRoute]),
  loginRoute,
  signupRoute,
])
