import React from "react";

export default function ActivityItem({ img, icon, title, time, description, tags, action }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex gap-4 hover:bg-blue-50 transition-colors">
      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-blue-100 flex items-center justify-center">
        {img ? (
          <img src={img} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-slate-500">{icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h6 className="font-semibold text-sm text-slate-900">{title}</h6>
          <span className="text-xs font-semibold text-slate-600 shrink-0 ml-2">{time}</span>
        </div>
        <p className="text-slate-600 text-xs mt-1">{description}</p>
        {tags && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                  tag.variant === "primary"
                    ? "bg-green-700/10 text-green-700"
                    : "bg-blue-100 text-slate-500"
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
        {action && (
          <div className="mt-3">
            <button className="text-green-700 border border-green-700 px-4 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition-all">
              {action}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}