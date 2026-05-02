import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Spinner } from "@jorh/ui";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useAuthInit } from "@/hooks/use-auth";
import { getRoleDashboardPath } from "@/lib/routing";
import type { UserRole } from "@jorh/types";

const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const ClientDashboardPage = lazy(() => import("@/pages/Dashboard"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboard"));
const LinksPage = lazy(() => import("@/pages/Links"));
const QrCodesPage = lazy(() => import("@/pages/QrCodes"));
const WhatsAppPage = lazy(() => import("@/pages/WhatsApp"));
const AnalyticsPage = lazy(() => import("@/pages/Analytics"));
const SettingsPage = lazy(() => import("@/pages/Settings"));

function AuthLayout() {
  const { firebaseUser, user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!firebaseUser || !user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function RoleHomeRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboardPath(user.role)} replace />;
}

function RoleGuard({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to={getRoleDashboardPath(user.role)} replace />;
  return <Outlet />;
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
            <Route path="/" element={<RoleHomeRedirect />} />

            <Route element={<RoleGuard allowedRoles={["client"]} />}>
              <Route path="/client/dashboard" element={<ClientDashboardPage />} />
              <Route path="/client/links" element={<LinksPage />} />
              <Route path="/client/tools/qr" element={<QrCodesPage />} />
              <Route path="/client/tools/whatsapp" element={<WhatsAppPage />} />
              <Route path="/client/analytics" element={<AnalyticsPage />} />
              <Route path="/client/settings" element={<SettingsPage />} />
            </Route>

            <Route element={<RoleGuard allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/links" element={<LinksPage />} />
              <Route path="/admin/tools/qr" element={<QrCodesPage />} />
              <Route path="/admin/tools/whatsapp" element={<WhatsAppPage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<RoleHomeRedirect />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
