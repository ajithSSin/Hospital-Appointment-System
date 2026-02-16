import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [doctor, setDoctor] = useState({ name: "", 
                                        specialization: "", 
                                        userId: "" });
  const [doctors, setDoctors] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token || user.role !== "admin") {
      navigate("/");
      return;
    }
    loadDoctors();
    loadDoctorUsers();
  }, []);

  const loadDoctors = async () => {
    try {
      //const res = await axios.get("http://localhost:5000/doctors");
      const res = await axios.get("api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDoctorUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/doctor-users", {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setDoctorUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addDoctor = async () => {
    if (!doctor.userId) {
      alert("Please select a user");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/add-doctor",
        doctor,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Doctor added successfully");
      setDoctor({ name: "", specialization: "", userId: "" });
      loadDoctors();
    } catch (err) {
      console.error(err);
      alert("Failed to add doctor");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <button onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Add Doctor</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              value={doctor.name}
              onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
              className="px-4 py-2 border rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Specialization"
              value={doctor.specialization}
              onChange={(e) => setDoctor({ ...doctor, specialization: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={doctor.userId}
              onChange={(e) => setDoctor({ ...doctor, userId: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select User (Doctor)</option>
              {doctorUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} (@{u.user})
                </option>
              ))}
            </select>
          </div>
          <button onClick={addDoctor} 
            className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Add Doctor
          </button>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">All Doctors</h3>
          <div className="grid gap-4">
            {doctors.length === 0 ? (
              <p className="text-gray-500">No doctors added yet.</p>
            ) : (
              doctors.map((d) => (
                <div key={d._id} className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-700">{d.name}</p>
                    <p className="text-gray-600">{d.specialization}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;