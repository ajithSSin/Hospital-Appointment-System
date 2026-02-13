import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Patient() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Load doctors
  useEffect(() => {
    axios.get("http://localhost:5000/doctors")
      .then(res => setDoctors(res.data));

    loadAppointments();
  }, []);

  const loadAppointments = () => {
    axios.get("http://localhost:5000/my-appointments", {
      headers: { Authorization: user.token }
    }).then(res => setAppointments(res.data));
  };

  const book = async () => {
    const res = await axios.post(
      "http://localhost:5000/book",
      form,
      { headers: { Authorization: user.token } }
    );

    alert(res.data.message || "Booked Successfully");
    loadAppointments();
  };

  const cancel = async (id) => {
    await axios.put(
      `http://localhost:5000/cancel/${id}`,
      {},
      { headers: { Authorization: user.token } }
    );
    alert("Cancelled");
    loadAppointments();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
  <div className="max-w-5xl mx-auto">

    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Patient Dashboard
      </h2>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

    {/* Booking Card */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Book Appointment
      </h3>

      <div className="grid md:grid-cols-3 gap-4">

        {/* Doctor Select */}
        <select
          onChange={(e) =>
            setForm({ ...form, doctorId: e.target.value })
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} - {d.specialization}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Time */}
        <input
          type="time"
          onChange={(e) =>
            setForm({ ...form, time: e.target.value })
          }
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

      </div>

      <button
        onClick={book}
        className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Book Appointment
      </button>
    </div>

    {/* Appointment List */}
    <div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
        My Appointments
      </h3>

      <div className="grid gap-6">

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">

                {/* Appointment Info */}
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    📅 {a.date}
                  </p>
                  <p className="text-gray-600">
                    ⏰ {a.time}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    a.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "Accepted"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>

              {/* Cancel Button */}
              {a.status === "Pending" && (
                <div className="mt-4">
                  <button
                    onClick={() => cancel(a._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))
        )}

      </div>
    </div>

  </div>
</div>

  );
}

export default Patient;