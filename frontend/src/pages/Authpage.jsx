import { useState } from "react";
import axios from "axios";

export default function AuthPage({ onLogin }) {

  const [view, setView] = useState("login");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", mobile_number: "" });

  const handleSubmit = async (e) => {


    e.preventDefault();


    const endpoint = view === "login" ? "/api/auth/login" : "/api/auth/register";

    const body = view === "login" ?
      { email: form.email, password: form.password } : { name: form.name, email: form.email, password: form.password, mobile_number: form.mobile_number };


    try {
      const { data } = await axios.post(endpoint, body, {
        withCredentials: true,
      })

      // save token to localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      onLogin(data.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-700/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-slate-500/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-green-700 text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              diversity_3
            </span>
            <h1 className="text-xl font-bold text-slate-900">ImpactHub</h1>
          </div>
          <p className="text-slate-600 text-sm">Community Action Network</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl p-8 border border-green-200 shadow-sm">


          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            {view === "login" ? "Welcome back" : "Join the movement"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  mail
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  Password
                </label>
                {view === "login" && (
                  <a href="#" className="text-green-700 text-xs font-semibold hover:underline">
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  placeholder={view === "register" ? "Min. 8 characters" : "••••••••"}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            {view === "register" && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    phone
                  </span>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all"
                    value={form.mobile_number}
                    onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : view === "login" ? "Login" : "Create Account"}
              {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
            </button>

          </form>

          <div className="mt-6 pt-5 border-t border-green-200 text-center">
            <p className="text-sm text-slate-600">
              {view === "login" ? "New to the community?" : "Already a volunteer?"}
              <button
                onClick={() => setView(view === "login" ? "register" : "login")}
                className="text-green-700 font-bold ml-1 hover:underline"
              >
                {view === "login" ? "Create an account" : "Log in here"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer image */}
        <div className="mt-6 rounded-xl overflow-hidden h-28 relative border border-green-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRlCrk3hznZpL1CzkJ_ZCJTHT-JrkpUR_9HLJBwiLCBquARJAn_plnHok5zYKMID-28YWEPrQdMtUzE2OXJW7gB7oficugYOoiH7N5zCJjvGNobj7raGpobSaDTigb9uQPb8POWnykhawCRH7ZDftFYs0ual-_oxviMQxKgpmA75EGinOYy5axf8XYOmk4IUqGxqTC6cGqPd5K5bc_eZt_CsERkIGyF8fuZWZYkcDJfTt-8AbKvFditwbBuFuRVwO7cxTwoDbeHkHj"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent flex items-end p-4">
            <p className="text-white text-xs font-bold uppercase tracking-widest">
              Together we grow greener
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}