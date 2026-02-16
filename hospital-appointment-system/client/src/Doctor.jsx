import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Doctor() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ////////// CHECK SESSION & ROLE //////////////
  useEffect(() => {
    if (!user || !user.token || user.role !== "doctor") {
      alert("Unauthorized access. Please login as doctor.");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }
    loadAppointments();
  }, []);

  //// LOAD APPOINTMENTS //////////
  const loadAppointments = async () => {
    try {
      //const res = await axios.get("http://localhost:5000/doctor-appointments", {
      const res = await axios.get("/api/doctor-appointments", {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      console.log("Appointments response:", res.data);

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else {
        // Handle all error messages from backend
        const msg = res.data?.message || "Unknown error";
        alert(`Failed to load appointments: ${msg}`);
        if (msg.includes("token") || msg.includes("Access denied")) {
          localStorage.removeItem("user");
          navigate("/");
        } else {
          setAppointments([]);
        }
      }
    } catch (err) {
      console.error(" Network/Server error:", err);
      alert("Failed to load appointments. Check console.");
      setAppointments([]);
    }
  };

  // ////////// SOCKET.IO – REAL TIME(listener) //////////////
  useEffect(() => {
    if (!user || !user.token) return;

    const socket = io("http://localhost:5000", {
                                                auth: { token: user.token }
                                              });

socket.on("new-appointment", (newAppointment) => {
  console.log("New appointment received:", newAppointment);

  // Get logged-in user ID from localStorage
  const userId = localStorage.getItem("userId");

  // Check if the appointment is for the current user
  if (newAppointment.doctorId === userId) {
    alert(`New appointment booked for ${newAppointment.date} at ${newAppointment.time}`);
  }

  // Optionally reload appointments regardless
  loadAppointments();
});


    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => socket.disconnect();
  }, []);

  // // UPDATE STATUS//
  const update = async (id, status) => {
    try {
      // await axios.put(`http://localhost:5000/update-status/${id}`,

      await axios.put(`/api/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Appointment updated successfully");
      loadAppointments();
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("Failed to update appointment.");
    }
  };

  // // LOGOUT //
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const goBack = () => navigate("/");

  // // UI //
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="absolute top-5 left-5">
        <button onClick={goBack} 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Back
        </button>
      </div>
      <div className="absolute top-5 right-5">
        <button onClick={logout} 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Doctor Dashboard</h2>

        <div className="space-y-6">
          {appointments.length === 0 ? (
            <p className="text-center text-gray-500">No appointments available.</p>
          ) : (
            appointments.map((a) => (
              <div key={a._id} 
                  className="border rounded-xl p-5 shadow-sm 
                              hover:shadow-md transition duration-300 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    
                    <p className="text-lg font-semibold text-gray-700">Dated: {a.date}</p>
                    <p className="text-gray-600">Slot time: {a.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    a.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                    a.status === "Accepted" ? "bg-blue-100 text-blue-700" :
                    a.status === "Completed" ? "bg-green-100 text-green-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {a.status}
                  </span>
                </div>
                {a.status !== "Completed" && a.status !== "Cancelled" && (
                  <div className="mt-4 flex gap-3">
                    {a.status === "Pending" && (
                      <button onClick={() => update(a._id, "Accepted")} 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                        Accept
                      </button>
                    )}
                    {a.status === "Accepted" && (
                      <button onClick={() => update(a._id, "Completed")} 
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                        Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Doctor;