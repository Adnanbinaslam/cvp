import axios from "axios";
import { useState } from "react";

export default function CreateTaskForm({ onSubmit }) {
  const [form, setForm] = useState({ title: "", description: "", location: "", date: "", duration: "", maxVolunteers: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      title: form.title,
      description: form.description,
      location: form.location,
      date: form.date ? `${form.date}T00:00:00` : "",
      duration: parseInt(form.duration) || 1,        // ✅ parse to int
      maxVolunteers: parseInt(form.maxVolunteers)||25
    };
    try {
      const { data } = await axios.post("/api/tasks", body, {
        withCredentials: true,
      });

      console.log("task created", data);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "something went wrong");
    }
    finally {
      setLoading(false);
    }

  };

  const inputClass =
    "w-full bg-white border border-green-200 rounded-lg p-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="col-span-full">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            Task Title
          </label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g., Community Garden Cleanup"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="col-span-full">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            Description
          </label>
          <textarea
            className={inputClass}
            placeholder="Describe the impact and requirements of this task..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            Event Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            Max Volunteers
          </label>
          <input
            type="number"
            className={inputClass}
            placeholder="25"
            value={form.maxVolunteers}
            onChange={(e) => setForm({ ...form, maxVolunteers: e.target.value })}
          />
        </div>
        <div className="col-span-full">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
            Location
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-lg">
              location_on
            </span>
            <input
              type="text"
              className={`${inputClass} pl-10`}
              placeholder="Street address or community center name"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-green-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span
            className="material-symbols-outlined text-green-700 text-base"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            info
          </span>
          Tasks are reviewed by admins within 24 hours.
        </div>
        <button
          type="submit"
          disabled={loading || done}
          className={`px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center gap-2 ${done
            ? "bg-green-500 text-white"
            : "bg-green-500 text-white hover:brightness-95 active:scale-95"
            }`}
        >
          {loading && (
            <span className="material-symbols-outlined animate-spin text-base">
              progress_activity
            </span>
          )}
          {loading ? "Submitting..." : done ? "Task Submitted! ✓" : "Submit Task"}
        </button>
      </div>
    </form>
  );
}