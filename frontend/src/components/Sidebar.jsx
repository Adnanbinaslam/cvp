import React from "react";

const NAV_ITEMS = [
  { key: "dashboard", icon: "dashboard", label: "Dashboard" },
  { key: "tasks", icon: "list_alt", label: "Tasks" },
  { key: "mytasks", icon: "assignment_ind", label: "My Tasks" },
  { key: "profile", icon: "person", label: "Profile" },
  { key: "create", icon: "add_circle", label: "Task Creation" },
];

const ADMIN_ITEM = { key: "admin", icon: "admin_panel_settings", label: "Admin Panel" };

export default function Sidebar({ activePage, onNavigate, onLogout, currentUser }) {


  const navItems = currentUser?.role === "ADMIN"
    ? [...NAV_ITEMS, ADMIN_ITEM]
    : NAV_ITEMS;

  return (
    <aside className="fixed left-0 top-0 h-full w-65 bg-blue-50 border-r border-green-200 flex flex-col py-8 z-50">
      {/* Logo */}
      <div className="px-6 mb-12">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-tight">ImpactHub</h1>
            <p className="text-xs text-slate-600 opacity-70">Community Action</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ key, icon, label }) => {
          const isActive = activePage === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-4 px-6 py-3 text-left transition-all duration-150 border-l-4 ${
                isActive
                  ? "bg-blue-100 text-slate-500 border-green-700 font-semibold"
                  : "text-slate-600 hover:bg-blue-100 border-transparent"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* CTA + Logout */}
      <div className="px-6 mt-auto space-y-3">
        <button
          onClick={() => onNavigate("create")}
          className="w-full bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 text-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Volunteer Task
        </button>
        <button
          onClick={onLogout}
          className="w-full text-slate-600 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Log out
        </button>
      </div>
    </aside>
  );
}