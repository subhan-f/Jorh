import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ToastProvider } from "@repo/ui/components/toast";
import { queryClient } from "./lib/query";
import { router } from "./router";
import { getStoredToken } from "./lib/auth";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <RouterProvider
          router={router}
          context={{ isAuthed: getStoredToken() !== null }}
        />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
