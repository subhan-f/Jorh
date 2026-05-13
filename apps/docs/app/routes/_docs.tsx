import { Outlet } from "@remix-run/react";
import { Sidebar } from "~/components/Sidebar";

export default function DocsLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="lg:pl-72">
        <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
