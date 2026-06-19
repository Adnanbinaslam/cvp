import React from "react";

export default function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-green-700 group-hover:bg-green-500 group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>

      </div>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  );
}