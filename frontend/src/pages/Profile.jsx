import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [enrolledTasks, setEnrolledTasks] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me", { withCredentials: true });
        setUser(data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    const fetchTasks = async () => {
      try {
        const { data } = await axios.get("/api/participants/my", { withCredentials: true });
        setEnrolledTasks(data.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    fetchUser();
    fetchTasks();
  }, []);

  if (!user) return <p className="p-8 text-slate-600">Loading...</p>;

  const currentTasks = enrolledTasks.filter(t => t.status !== "COMPLETED");
  const pastTasks = enrolledTasks.filter(t => t.status === "COMPLETED");

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-8">
        {/* Info card */}
        <div className="md:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-green-200 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="bg-green-700/10 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {user.role}
            </span>
          </div>
          <div className="w-28 h-28 rounded-xl border-4 border-slate-50 shadow-md shrink-0 bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-green-700">person</span>
          </div>
          <div className="grow space-y-4 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              <p className="text-slate-600 text-sm flex items-center justify-center md:justify-start gap-1 mt-1">
                <span className="material-symbols-outlined text-base">mail</span>
                {user.email}
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <span className="bg-blue-50 text-slate-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">phone</span>
                {user.mobileNumber}
              </span>
              <span className="bg-blue-50 text-slate-600 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">event_available</span>
                Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </span>
            </div>
           
          </div>
        </div>

        {/* Stats card */}
        <div className="md:col-span-4 bg-green-700 text-white p-8 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-xl font-bold mb-1">Impact Summary</h4>
            <p className="text-white/70 text-xs">Making a difference</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{pastTasks.length}</div>
              <div className="text-xs opacity-80">Tasks Done</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold">{enrolledTasks.length}</div>
              <div className="text-xs opacity-80">Total Enrolled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Tasks */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-700">pending_actions</span>
              Current Tasks
            </h4>
            <span className="text-xs text-slate-600">{currentTasks.length} Active</span>
          </div>
          <div className="space-y-4">
            {currentTasks.length === 0 ? (
              <p className="text-slate-500 text-sm">No active tasks</p>
            ) : (
              currentTasks.map((t, i) => (
                <div key={i} className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                      {t.status}
                    </span>
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {new Date(t.taskDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 mb-2">{t.taskTitle}</h5>
                  <p className="text-slate-600 text-xs line-clamp-2">{t.taskLocation}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Past Tasks */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-600">history</span>
              Past Tasks
            </h4>
            <button className="text-green-700 font-bold text-xs hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
            {pastTasks.length === 0 ? (
              <p className="text-slate-500 text-sm p-4">No completed tasks yet</p>
            ) : (
              <div className="divide-y divide-green-200">
                {pastTasks.map((p, i) => (
                  <div key={i} className="p-4 hover:bg-blue-50 transition-colors cursor-pointer flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 text-slate-600">
                      <span className="material-symbols-outlined text-xl">task_alt</span>
                    </div>
                    <div className="grow">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-sm text-slate-900">{p.taskTitle}</h5>
                        <span className="text-green-700 font-bold text-xs flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">verified</span>
                          Done
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Completed on {new Date(p.taskDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}