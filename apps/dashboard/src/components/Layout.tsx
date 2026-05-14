import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mt-14 lg:mt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
