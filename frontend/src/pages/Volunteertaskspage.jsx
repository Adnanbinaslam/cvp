import TaskCard from "../components/Taskcard";
import { useState, useEffect } from "react";
import axios from "axios";


function VolunteerTasksPage() {

  // ✅ add these here
  const [tasks, setTasks] = useState([]);

 const handleSignup = async (taskId) => {
  try {
    await axios.post(`/api/participants/signup/${taskId}`, {}, {
      withCredentials: true,
    });
    alert("Signed up successfully!");
    fetchTasks(); // refresh spots count
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};



  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("/api/tasks", {
        withCredentials: true,
      });
      console.log("response:", data)
      setTasks(data.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };


  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold text-slate-900 mb-1">Available Tasks</h3>
          <p className="text-slate-600 text-sm">Find a way to contribute to your local community today.</p>
        </div>





        <p className="text-slate-600 text-xs font-semibold">
          <span className="font-bold text-green-700">{tasks.length}</span> active opportunities
        </p>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">




        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            // img="https://images.unsplash.com/vector-1766996683231-7037ba226238?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            img = "https://plus.unsplash.com/premium_photo-1681505195930-388c317b7a76?q=80&w=1084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

            badge={task.status}
            title={task.title}
            date={new Date(task.date).toLocaleDateString("en-IN")}
            location={task.location}
            spotsLeft={task.maxVolunteers - task.participantCount}
            spotsTotal={task.maxVolunteers}
            onAction={() => handleSignup(task.id)}
          />
        ))}

      </div>
    </div>
  );
}

export default VolunteerTasksPage;