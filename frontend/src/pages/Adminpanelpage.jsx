

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanelPage() {
  const [pendingList, setPendingList] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, completedTasks: 0, openTasks: 0 });
  const [volunteers, setVolunteers] = useState([]);

  const fetchPending = async () => {
    try {
      const { data } = await axios.get("/api/tasks/pending", { withCredentials: true });
      console.log("pending:", data);
      setPendingList(data.data);
    } catch (err) {
      console.error("Failed to fetch pending tasks", err);
    }
  };



  const fetchAllTasks = async () => {
    try {
      const { data } = await axios.get("/api/tasks", { withCredentials: true });
      setTasks(data.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };


  const fetchStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/stats", { withCredentials: true });
      setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchVolunteers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users", { withCredentials: true });
      setVolunteers(data.data);
    } catch (err) {
      console.error("Failed to fetch volunteers", err);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchAllTasks();
    fetchStats();
    fetchVolunteers();
  }, []);

  const handleApprove = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/approve`, {}, { withCredentials: true });
      fetchPending();
      fetchAllTasks();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}/reject`, {}, { withCredentials: true });
      fetchPending();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, { withCredentials: true });
      fetchAllTasks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-green-200 flex justify-between items-end relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Total Impact Hours</p>
            <h3 className="text-5xl font-bold text-green-700 leading-none">
              {stats.totalImpactHours || 0}
            </h3>
            <p className="text-xs font-bold text-green-700 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-base">trending_up</span>
              +12% from last month
            </p>
          </div>
          <span className="material-symbols-outlined text-green-700/10 text-9xl absolute -right-2 -bottom-2">
            volunteer_activism
          </span>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-green-200">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Active Volunteers</p>
          <h3 className="text-4xl font-bold text-slate-900">{stats.totalUsers}</h3>  {/* ✅ */}
          <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-700 rounded-full" style={{ width: "75%" }} />
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-green-200">
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Completed Tasks</p>
          <h3 className="text-4xl font-bold text-slate-900">{stats.completedTasks}</h3>  {/* ✅ */}
          <p className="text-xs text-slate-600 mt-2">94% Success Rate</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">

          {/* Pending approvals */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-lg font-bold text-slate-900">Pending Task Approvals</h4>
              {pendingList.length > 0 && (
                <span className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-xs font-bold">
                  {pendingList.length} Urgent
                </span>
              )}
            </div>
            {pendingList.length === 0 ? (
              <div className="bg-white rounded-xl border border-green-200 p-8 text-center text-slate-600 text-sm">
                All caught up — no pending approvals!
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-green-200 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:shadow-md transition-all"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-blue-50 text-green-700">
                        <span className="material-symbols-outlined text-xl">task</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-slate-900">{item.title}</h5>
                        <p className="text-xs text-slate-600">
                          Proposed by {item.createdBy?.name} • {item.location}
                        </p>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-4 py-2 text-slate-600 border border-green-200 rounded-lg font-bold text-xs hover:bg-red-100 hover:text-red-700 hover:border-red-700 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-4 py-2 bg-green-700 text-white rounded-lg font-bold text-xs hover:opacity-90 transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All tasks table */}
          <div className="bg-white rounded-xl shadow-sm border border-green-200 overflow-hidden">
            <div className="p-5 border-b border-green-200 flex justify-between items-center bg-slate-50">
              <h4 className="text-lg font-bold text-slate-900">All Tasks</h4>
              <button className="text-xs text-slate-600 border border-green-200 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-50 transition-colors">
                <span className="material-symbols-outlined text-base">filter_list</span>
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Task Name</th>
                    <th className="px-6 py-3">Location</th>
                    <th className="px-6 py-3">Volunteers</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-200">
                  {tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-sm">{t.title}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                          {t.location}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {t.participantCount} / {t.maxVolunteers}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 font-bold text-xs ${t.status === "OPEN" ? "text-green-700" : "text-slate-500"
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${t.status === "OPEN" ? "bg-green-700" : "bg-slate-400"
                            }`} />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="text-slate-600 hover:text-red-700 transition-colors p-1 ml-1"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: volunteers — keeping hardcoded, no users endpoint yet */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">All Volunteers</h4>
            <button className="text-green-700 font-bold text-xs hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 divide-y divide-green-200">
            {volunteers.length === 0 ? (
              <p className="text-slate-500 text-sm py-2">No volunteers yet</p>
            ) : (
              volunteers.map((v, i) => (
                <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center border border-green-200 shrink-0">
                    <span className="material-symbols-outlined text-green-700 text-base">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-bold text-sm text-slate-900 truncate">{v.name}</h6>
                    <p className="text-xs text-slate-600">{v.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}