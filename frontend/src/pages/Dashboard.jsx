import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "../components/StatCard";
import ActivityItem from "../components/ActivityItem";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Dashboard({onNavigate}) {
    const [user, setUser] = useState(null);
    const [mySignups, setMySignups] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [upcomingTasks, setUpcomingTasks] = useState([]);


    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [userRes, signupsRes, upcomingRes] = await Promise.all([
                    axios.get("/api/auth/me", { withCredentials: true }),
                    axios.get("/api/participants/my", { withCredentials: true }),
                    axios.get("/api/tasks/upcoming", { withCredentials: true }),
                ]);
                setUser(userRes.data.data);
                setMySignups(signupsRes.data.data || []);
                setUpcomingTasks(upcomingRes.data.data || []);
            } catch (err) {
                console.error("Dashboard fetch failed", err);
                // ✅ set safe defaults if anything fails
                setMySignups([]);
                setUpcomingTasks([]);
            }
        };
        fetchAll();
    }, []);


    const completedCount = mySignups.filter(t => t.status === "COMPLETED").length;
    const nextTask = upcomingTasks[0];

    if (!user) return <p className="p-8 text-slate-600">Loading...</p>;

    return (
        <div className="p-8 max-w-7xl">
            {/* Welcome Hero */}
            <section className="relative overflow-hidden rounded-xl bg-green-700 h-44 mb-8 flex flex-col justify-center px-12 text-white">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.4),transparent)]" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-bold mb-1">Welcome back, {user.name}!</h3>
                    <p className="opacity-90 max-w-lg text-sm">
                        You have {upcomingTasks.length} upcoming tasks. Let's see what we can achieve today.
                    </p>
                </div>
                <img
                    className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-25 mix-blend-overlay"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAegg1GDBN2doO54gz7ep4swiphY1BqhN_2Xu9MDohxvvi-1RdYxrG9Z6HgFAgHlzkmie6G5AV3lhF0LNfo02FXNBin4JUZoQr_22SwOocvlro3ec5p2pNLGXpPuVfF4d2Y5DZXMNQqXmD7yzKoaVsgbV4RVHxb4LLXt1TfH4dDSQjyLIDSJNAJNX79x2k68wN2lZa3zvd0rF3En_vE7-o1o1kPltyNbWfETnyX9A7HwQuLwEEg59hCtKfDQhjVG7l4iuX31hmRTvZq"
                    alt="Volunteers"
                />
            </section>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <StatCard icon="group_add" label="Tasks Joined" value={mySignups.length} />
                <StatCard icon="event_repeat" label="Upcoming Tasks" value={upcomingTasks.length} />
                <StatCard icon="task_alt" label="Completed Tasks" value={completedCount} />
            </div>

            {/* Main split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="text-xl font-bold text-slate-900">Recent Activity</h5>
                        <button onClick={() => onNavigate("mytasks")} className="text-green-700 font-semibold hover:underline text-xs">View All History</button>
                    </div>
                    <div className="space-y-4">
                        {mySignups.length === 0 ? (
                            <p className="text-slate-500 text-sm">No recent activity</p>
                        ) : (
                            mySignups.slice(0, 3).map((activity, i) => (
                                <ActivityItem
                                    key={i}
                                    icon="task_alt"
                                    title={activity.taskTitle}
                                    time={new Date(activity.taskDate).toLocaleDateString("en-IN")}
                                    description={`You signed up for ${activity.taskTitle} at ${activity.taskLocation}`}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm h-64">
                        <h5 className="font-semibold text-base mb-3">Task Locations</h5>
                        <MapContainer center={[17.3850, 78.4867]} zoom={11} className="h-48 rounded-lg">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {upcomingTasks.map(task => (
                                task.latitude && task.longitude && (
                                    <Marker key={task.id} position={[task.latitude, task.longitude]}>
                                        <Popup>{task.title}</Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    </div>

                    {/* Next Task — real data */}
                    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
                        <h5 className="font-semibold text-base mb-4">Next Task</h5>
                        {nextTask ? (
                            <>
                                <div className="relative rounded-lg overflow-hidden h-28 mb-4 bg-green-100 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-2 left-3 text-white">
                                        <p className="text-xs font-bold uppercase tracking-widest">
                                            {new Date(nextTask.date).toLocaleDateString("en-IN")}
                                        </p>
                                        <p className="text-xs font-semibold leading-tight">{nextTask.title}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                                        <span className="material-symbols-outlined text-base">location_on</span>
                                        <span>{nextTask.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-xs">
                                        <span className="material-symbols-outlined text-base">group</span>
                                        <span>{nextTask.participantCount} / {nextTask.maxVolunteers} Volunteers</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTaskModal(true)}
                                    className="w-full py-2 bg-blue-100 text-slate-900 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-xs"
                                >
                                    Details & Logistics
                                </button>
                            </>
                        ) : (
                            <p className="text-slate-500 text-sm">No upcoming tasks</p>
                        )}
                    </div>
                </div>
            </div>


            {showTaskModal && nextTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{nextTask.title}</h3>
                        <p className="text-slate-600 text-sm mb-2">
                            <span className="font-semibold">Date:</span> {new Date(nextTask.date).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-slate-600 text-sm mb-2">
                            <span className="font-semibold">Location:</span> {nextTask.location}
                        </p>
                        <p className="text-slate-600 text-sm mb-2">
                            <span className="font-semibold">Duration:</span> {nextTask.duration} hours
                        </p>
                        <p className="text-slate-600 text-sm mb-6">
                            <span className="font-semibold">Volunteers:</span> {nextTask.participantCount} / {nextTask.maxVolunteers}
                        </p>
                        <button
                            onClick={() => setShowTaskModal(false)}
                            className="w-full bg-green-700 text-white py-2 rounded-lg font-bold text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}