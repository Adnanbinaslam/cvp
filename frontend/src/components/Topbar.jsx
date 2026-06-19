import React from "react";

const PAGE_TITLES = {
  dashboard: "Volunteer Dashboard",
  tasks: "Available Tasks",
  mytasks: "My Tasks",
  profile: "My Profile",
  create: "Create a Task",
  admin: "Admin Panel",
};

export default function TopBar({ activePage,currentUser }) {
  return (
    <header className="fixed top-0 right-0 h-16 w-[calc(100%-260px)] bg-slate-50 border-b border-green-200 flex justify-between items-center px-8 z-40">
      <h2 className="text-xl font-bold text-slate-900">
        {PAGE_TITLES[activePage] || "Dashboard"}
      </h2>
      <div className="flex items-center gap-5">
        
       
        {/* Divider */}
        <div className="h-6 w-px bg-green-200" />
        {/* Avatar + name */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full border border-green-200 bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-700 text-base">person</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {currentUser?.name || "User"}
            </p>
            <p className="text-xs text-slate-600">
              {currentUser?.role === "ADMIN" ? "Admin" : "Volunteer"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}