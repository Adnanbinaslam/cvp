import TaskCard from "../components/Taskcard";
import { useState, useEffect } from "react";
import axios from "axios"

export default function MyTasksPage() {



  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [enrolledTasks, setEnrolledTasks] = useState([]);
  const [historyTasks, setHistoryTasks] = useState([]);


  const fetchMySignups = async () => {
    try {
      const { data } = await axios.get("/api/participants/my", {
        withCredentials: true,
      });

      console.log("signups response:", data);
      const all = data.data; // unwrap ApiResponse

      // split into active vs completed based on status
      setEnrolledTasks(all.filter(t => t.status !== "COMPLETED"));
      setHistoryTasks(all.filter(t => t.status === "COMPLETED"));
    } catch (err) {
      console.error("Failed to fetch signups", err);
    }

  };




  useEffect(() => {
    fetchMySignups();
  }, []);

  const totalHours = historyTasks.reduce((sum, t) => sum + (t.taskDuration || 2), 0);
  const points = historyTasks.length * 10;

  const handleWithdraw = async (taskId) => {
    try {
      await axios.delete(`/api/participants/withdraw/${taskId}`, {
        withCredentials: true,
      });
      fetchMySignups(); // refresh list
    } catch (err) {
      console.error("Withdraw failed", err);
    }
  };



  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">Management Center</h3>
          <p className="text-slate-600 text-sm">Track your ongoing commitments and community impact history.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-100 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
            <span
              className="material-symbols-outlined text-green-700 text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emoji_events
            </span>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Points</p>
              <p className="text-xl font-bold text-green-700 leading-none">{points}</p>
            </div>
          </div>
          <div className="bg-blue-100 px-4 py-3 rounded-xl shadow-sm flex items-center gap-3">
            <span
              className="material-symbols-outlined text-slate-500 text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              timer
            </span>
            <div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hours</p>
              <p className="text-xl font-bold text-slate-900 leading-none">{totalHours}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Currently Enrolled */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-8 bg-green-700 rounded-full" />
          <h4 className="text-xl font-bold text-slate-900">Currently Enrolled</h4>
          <span className="bg-green-700/10 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{enrolledTasks.length} ACTIVE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">






          {enrolledTasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No active enrollments</p>
          ) : (
            enrolledTasks.map((t, i) => (
              <TaskCard
                key={i}
                title={t.taskTitle}
                date={new Date(t.taskDate).toLocaleDateString("en-IN")}
                location={t.taskLocation}
                status={t.status}
                actionLabel="Details"
                onAction={() => setSelectedTask(t)}
                secondaryLabel="Withdraw"
                onSecondary={() => handleWithdraw(t.taskId)}
              />
            ))
          )}



        </div>
      </section>

      {/* History Table */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1.5 h-8 bg-green-200 rounded-full" />
          <h4 className="text-xl font-bold text-slate-900">Previously Completed</h4>
        </div>
        <div className="bg-blue-50 rounded-xl overflow-hidden border border-green-200">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-blue-100 border-b border-green-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <div className="col-span-5 px-4">Task Activity</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-center">Log</div>
          </div>
          <div className="divide-y divide-green-200">





            {historyTasks.map((h, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-blue-100 transition-colors">
                <div className="col-span-5 px-4 flex items-center gap-4">
                  <span className="font-bold text-sm text-slate-900">{h.taskTitle}</span>
                </div>
                <div className="col-span-2 text-slate-600 text-xs">
                  {new Date(h.taskDate).toLocaleDateString("en-IN")}
                </div>
                <div className="col-span-3 text-slate-600 text-xs">{h.taskLocation}</div>
                <div className="col-span-1">
                  <span className="bg-blue-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">DONE</span>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => setSelectedLog(h)}
                    className="p-1.5 hover:bg-green-700/10 rounded-full text-green-700 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">receipt_long</span>
                  </button>
                </div>
              </div>
            ))}



          </div>
        </div>

      </section>

      {/* 
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{selectedTask.taskTitle}</h3>
            <p className="text-slate-600 text-sm mb-2">
              <span className="font-semibold">Location:</span> {selectedTask.taskLocation}
            </p>
            <p className="text-slate-600 text-sm mb-2">
              <span className="font-semibold">Date:</span> {new Date(selectedTask.taskDate).toLocaleDateString("en-IN")}
            </p>
            <p className="text-slate-600 text-sm mb-6">
              <span className="font-semibold">Status:</span> {selectedTask.status}
            </p>
            <button
              onClick={() => setSelectedTask(null)}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )} */}


      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center mb-6">
              <span className="material-symbols-outlined text-green-700 text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Volunteer Certificate</h3>
              <p className="text-slate-600 text-xs mt-1">Proof of Contribution</p>
            </div>
            <div className="space-y-3 bg-green-50 rounded-lg p-4">
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Task:</span> {selectedLog.taskTitle}
              </p>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Location:</span> {selectedLog.taskLocation}
              </p>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Date:</span> {new Date(selectedLog.taskDate).toLocaleDateString("en-IN")}
              </p>
              <p className="text-slate-600 text-sm">
                <span className="font-semibold">Status:</span> {selectedLog.status}
              </p>
            </div>
            <button
              onClick={() => setSelectedLog(null)}
              className="w-full bg-green-700 text-white py-2 rounded-lg font-bold text-sm mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>



  );
}