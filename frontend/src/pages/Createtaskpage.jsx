import { useEffect, useState } from "react";
import axios from "axios";
import CreateTaskForm from "../pages/CreateTaskForm";


const TIPS = [
  "Be specific about tools volunteers need to bring.",
  "Include a clear meeting point if the location is large.",
  "High-quality titles attract 30% more sign-ups.",
];

export default function CreateTaskPage() {



  const [recentTasks, setRecentTasks] = useState([]);


  const fetchMyTasks = async () => {
    try {
      const { data } = await axios.get("/api/tasks/my", {
        withCredentials: true,
      });
      setRecentTasks(data.data.slice(0, 3));
    } catch (err) {
      console.log("Failed to fetch tasks", err);
    }
  };


  useEffect(() => {
    fetchMyTasks();
  }, []);



  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form */}
        <section className="flex-1 w-full">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900 mb-1">Create New Task</h3>
            <p className="text-slate-600 text-sm">Define a new community initiative to mobilize volunteers.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-green-200">
            <CreateTaskForm />
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          {/* Tips */}
          <div className="bg-blue-50 rounded-xl p-6 border border-green-200">
            <h4 className="text-lg font-bold text-slate-900 mb-4">Quick Tips</h4>
            <ul className="space-y-4">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="material-symbols-outlined text-green-500 text-xl shrink-0"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <p className="text-xs text-slate-600">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recently submitted */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">
              Recently Submitted
            </h4>



            <div className="space-y-3">
              {recentTasks.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No tasks submitted yet</p>
              ) : (
                recentTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-xl p-4 border border-green-200 shadow-sm relative overflow-hidden">
                    <span className="absolute top-3 right-3 bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/20">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {task.status}
                    </span>
                    <h5 className="font-bold text-sm text-slate-600 mb-2">{task.title}</h5>
                    <div className="flex items-center gap-2 text-slate-600 text-xs mb-3">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {new Date(task.date).toLocaleDateString("en-IN")}
                    </div>
                    <div className="w-full h-1.5 bg-blue-50 rounded-full" />
                    <p className="text-xs text-slate-600 mt-1 text-right">
                      {task.participantCount} / {task.maxVolunteers} Volunteers
                    </p>
                  </div>
                ))
              )}
            </div>



            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm relative overflow-hidden">
              <span className="absolute top-3 right-3 bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-500/20">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Pending Approval
                {/* {task.status} */}
              </span>
              <div className="w-full h-28 rounded-lg bg-blue-100 mb-4 overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLM49sMW9kg5tlSV6_7pRg0fH5OsQXHF27-eEzUI5gVAqkLN4CkTRSiDtnunMgLWPKonY8puq6SnopSpHkCDKaEOOwxF-62Ix2hDwQ5jSD90bUk9liKdHU8BPPw2VQDIbHypfgr3MIeVJrNoBugY8Hq9obqKwt9rWmmITReGvLtXpsUsAEPrf1MQCMq9xJYFZwGXlf_okSEbrpxSXQY7HKtRq5G-2vM83r7qA_NGdOzarFmD4adHh8fJ-sUq0Q0pMYsi2zU_tqYpkr"
                  alt="Downtown Food Drive"
                  className="w-full h-full object-cover grayscale opacity-60"
                />
              </div>
              <h5 className="font-bold text-sm text-slate-600 mb-2">Downtown Food Drive</h5>
              <div className="flex items-center gap-2 text-slate-600 text-xs mb-3">
                <span className="material-symbols-outlined text-sm">calendar_today</span>
                Oct 24, 2023
              </div>
              <div className="w-full h-1.5 bg-blue-50 rounded-full" />
              <p className="text-xs text-slate-600 mt-1 text-right">0 / 15 Volunteers</p>

            </div>
          </div>

          {/* Motivational banner */}
          <div className="h-40 rounded-xl overflow-hidden relative border border-green-200">
            <div className="absolute inset-0 bg-linear-to-br from-green-700 to-green-500" />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <p className="text-white font-bold text-xl leading-tight">Impact Begins Here.</p>
              <p className="text-white/80 text-xs mt-1">Every task created helps your community thrive.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}