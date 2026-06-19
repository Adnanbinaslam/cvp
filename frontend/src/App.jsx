import { useState } from "react";
import AppShell from "./pages/AppShell";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import VolunteerTasksPage from "./pages/VolunteerTasksPage";
import MyTasksPage from "./pages/MyTasksPage";
import ProfilePage from "./pages/ProfilePage";
import CreateTaskPage from "./pages/CreateTaskPage";
import AdminPanelPage from "./pages/AdminPanelPage";

export default function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem("token"));
  const [activePage, setActivePage] = useState("dashboard");
  const [currentUser, setCurrentUser] = useState(() => {  // ← fix 1: read user from localStorage on refresh
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  if (!authed) {
    return <AuthPage onLogin={(user) => {
      setAuthed(true);
      setCurrentUser(user); // ✅ store user on login
    }} />;
  }

  const pages = {
    dashboard: <Dashboard onNavigate={setActivePage} />,
    tasks: <VolunteerTasksPage />,
    mytasks: <MyTasksPage />,
    profile: <ProfilePage onNavigate={setActivePage} />,
    create: <CreateTaskPage />,
    admin: <AdminPanelPage />,
  };

  return (
    <AppShell
      activePage={activePage}
      onNavigate={setActivePage}
      onLogout={() => {
        localStorage.removeItem("token");   // ← fix 2: clear on logout
        localStorage.removeItem("user"); setAuthed(false); setCurrentUser(null);
      }}
      currentUser={currentUser}
    >
      {pages[activePage] ?? <Dashboard />}
    </AppShell>
  );
}