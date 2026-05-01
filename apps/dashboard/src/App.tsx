import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Spinner } from "@jorh/ui";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useAuthInit } from "@/hooks/use-auth";

const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const LinksPage = lazy(() => import("@/pages/Links"));

function AuthLayout() {
  const { firebaseUser, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!firebaseUser) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  useAuthInit();

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex min-h-dvh items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/links" element={<LinksPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
