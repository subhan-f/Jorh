import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { cn, type HttpMethod } from "~/lib/utils";
import { MethodBadge } from "~/components/MethodBadge";
import { ApiStatus } from "~/components/ApiStatus";

interface EndpointLink {
  method: HttpMethod;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  href: string;
  endpoints: EndpointLink[];
}

interface NavGroup {
  group: string;
  links?: { label: string; href: string }[];
  sections?: NavSection[];
}

const navigation: NavGroup[] = [
  {
    group: "Overview",
    links: [
      { label: "Introduction", href: "/" },
      { label: "Base URL & Auth", href: "/#authentication" },
      { label: "Error Codes", href: "/#errors" },
      { label: "Rate Limiting", href: "/#rate-limiting" },
    ],
  },
  {
    group: "API Reference",
    sections: [
      {
        title: "Authentication",
        href: "/authentication",
        endpoints: [
          { method: "POST", label: "Register", href: "/authentication#register" },
          { method: "POST", label: "Login", href: "/authentication#login" },
          { method: "POST", label: "Logout", href: "/authentication#logout" },
          { method: "GET", label: "Get Profile", href: "/authentication#get-profile" },
          { method: "PATCH", label: "Update Profile", href: "/authentication#update-profile" },
        ],
      },
      {
        title: "Links",
        href: "/links",
        endpoints: [
          { method: "GET", label: "List Links", href: "/links#list-links" },
          { method: "POST", label: "Create Link", href: "/links#create-link" },
          { method: "GET", label: "Get Link", href: "/links#get-link" },
          { method: "PATCH", label: "Update Link", href: "/links#update-link" },
          { method: "DELETE", label: "Delete Link", href: "/links#delete-link" },
        ],
      },
      {
        title: "Analytics",
        href: "/analytics",
        endpoints: [
          { method: "GET", label: "Link Stats", href: "/analytics#link-stats" },
          { method: "GET", label: "Click History", href: "/analytics#click-history" },
        ],
      },
      {
        title: "Redirect",
        href: "/redirect",
        endpoints: [
          { method: "GET", label: "Resolve Slug", href: "/redirect#resolve" },
        ],
      },
    ],
  },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isActive = pathname === href.split("#")[0] && href === pathname;
  return (
    <Link
      to={href}
      className={cn("sidebar-link", isActive && "active")}
    >
      {children}
    </Link>
  );
}

function SectionItem({ section }: { section: NavSection }) {
  const { pathname } = useLocation();
  const isActive = pathname === section.href;
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "sidebar-link w-full text-left font-medium",
          isActive && "text-slate-100",
        )}
      >
        <span className="flex-1">{section.title}</span>
        <span className="text-slate-600 text-xs">{open ? "▾" : "▸"}</span>
      </button>

      {open && (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
          {section.endpoints.map((ep) => (
            <Link
              key={ep.href}
              to={ep.href}
              className="flex items-center gap-2 py-1 text-[13px] text-slate-500 hover:text-slate-200 transition-colors"
            >
              <MethodBadge method={ep.method} size="sm" />
              <span className="truncate">{ep.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
          <Zap size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100 tracking-tight">Jorh</div>
          <div className="text-[10px] text-slate-500 font-mono">API v1.0</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigation.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
              {group.group}
            </div>

            <div className="space-y-0.5">
              {group.links?.map((l) => (
                <NavLink key={l.href} href={l.href}>
                  {l.label}
                </NavLink>
              ))}

              {group.sections?.map((s) => (
                <SectionItem key={s.href} section={s} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4 space-y-3">
        <ApiStatus />
        <p className="text-[11px] text-slate-600 px-1">
          Base URL:{" "}
          <code className="text-slate-400 font-mono">http://localhost:3000</code>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar text-slate-400 shadow-lg border border-sidebar-border"
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar transform transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X size={18} />
        </button>
        {content}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-72 bg-sidebar border-r border-sidebar-border">
        {content}
      </aside>
    </>
  );
}
