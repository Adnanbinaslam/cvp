
export default function TaskCard({ img, badge, title, date, location, spotsLeft, spotsTotal, status, onAction, actionLabel = "Details", onSecondary, secondaryLabel }) {
  const spotsPercent = spotsTotal ? Math.round((spotsLeft / spotsTotal) * 100) : null;

  return (
    <div className="bg-white rounded-xl border border-green-200 shadow-sm overflow-hidden group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="h-36 relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={img}
          alt={title}
        />
        {badge && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase">
            {badge}
          </span>
        )}
        {status && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {status}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col grow">
        <h5 className="font-bold text-sm text-slate-900 mb-2 leading-snug">{title}</h5>
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <span className="material-symbols-outlined text-base">calendar_today</span>
          <span className="text-xs">{date}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 mb-4">
          <span className="material-symbols-outlined text-base">location_on</span>
          <span className="text-xs">{location}</span>
        </div>

        {spotsTotal != null && (
          <div className="pt-3 border-t border-green-200 flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-slate-600 uppercase tracking-wider block">Spots Left</span>
              <span className="font-bold text-green-700 text-sm">{spotsLeft} / {spotsTotal}</span>
            </div>
            <button
              onClick={onAction}
              className="bg-green-700 text-white px-5 py-1.5 rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm"
            >
              Sign Up
            </button>
          </div>
        )}

        {onAction && spotsTotal == null && (
          <div className="flex gap-3 mt-auto pt-3 border-t border-green-200">
            <button
              onClick={onAction}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold text-xs hover:brightness-110 transition-all"
            >
              {actionLabel}
            </button>
            {onSecondary && (
              <button
                onClick={onSecondary}
                className="flex-1 border border-green-200 text-slate-600 py-2 rounded-lg font-bold text-xs hover:bg-red-100 hover:text-red-700 hover:border-red-700 transition-all"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}