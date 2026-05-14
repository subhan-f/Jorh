import {
  createRouter,
  createRootRouteWithContext,
  createRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { getStoredToken } from "./lib/auth";
import { setAuthToken } from "./lib/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LinkDetail from "./pages/LinkDetail";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// Hydrate token on startup
const storedToken = getStoredToken();
if (storedToken) {
  setAuthToken(storedToken);
}

interface RouterContext {
  isAuthed: boolean;
}

// Root route
const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: Outlet,
  notFoundComponent: NotFound,
});

// Index: redirect to /links
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/links" });
  },
});

// Login route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context }) => {
    if (context.isAuthed) {
      throw redirect({ to: "/links" });
    }
  },
  component: Login,
});

// Register route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  beforeLoad: ({ context }) => {
    if (context.isAuthed) {
      throw redirect({ to: "/links" });
    }
  },
  component: Register,
});

// Auth layout route — requires authentication
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "_auth",
  beforeLoad: ({ context }) => {
    if (!context.isAuthed) {
      throw redirect({ to: "/login" });
    }
  },
  component: Layout,
});

// Links list
const linksRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/links",
  component: Dashboard,
});

// Link detail
const linkDetailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/links/$slug",
  component: LinkDetail,
});

// Settings
const settingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/settings",
  component: Settings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  authRoute.addChildren([linksRoute, linkDetailRoute, settingsRoute]),
]);

export const router = createRouter({
  routeTree,
  context: { isAuthed: false },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
