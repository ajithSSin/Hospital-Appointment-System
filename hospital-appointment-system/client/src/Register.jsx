import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const register = async () => {
    // await axios.post("http://localhost:5000/register", 
    await axios.post("/api/register", 
                    form);
    alert("Registered Successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
  <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
      Create Account
    </h2>

    <input
      type="text"
      placeholder="Full Name"
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="w-full px-4 py-2 mb-4 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <input
      type=""
      placeholder="Username"
      onChange={(e) => setForm({ ...form, user: e.target.value })}
      className="w-full px-4 py-2 mb-4 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setForm({ ...form, password: e.target.value })}
      className="w-full px-4 py-2 mb-4 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    <select
      onChange={(e) => setForm({ ...form, role: e.target.value })}
      className="w-full px-4 py-2 mb-4 border rounded-lg bg-white 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select Role</option>
      <option value="admin">Admin</option>
      <option value="doctor">Doctor</option>
      <option value="patient">Patient</option>
    </select>

    <button
      onClick={register}
      className="w-full bg-blue-500 text-white py-2 rounded-lg 
              hover:bg-blue-600 transition duration-300"
    >
      Register
    </button>

  </div>
</div>
  );
}

export default Register;