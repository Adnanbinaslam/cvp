import React from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function AppShell({ activePage, onNavigate, onLogout, children, currentUser }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onLogout={onLogout} currentUser={currentUser} />
      <TopBar activePage={activePage} currentUser={currentUser} />
      <main className="ml-65 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}