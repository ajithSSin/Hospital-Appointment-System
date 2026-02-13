import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [doctor, setDoctor] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const addDoctor = async () => {
    await axios.post("http://localhost:5000/add-doctor", doctor, {
      headers: { Authorization: user.token }
    });
    alert("Doctor Added");
  };

   //  Logout Function
  const logout = () => {
    localStorage.removeItem("user"); // remove token
    navigate("/"); // redirect to login page
  };

  // Back Function
  const goBack = () => {
    navigate("/"); // go to previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="absolute top-5 left-5">
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      <div className="absolute top-5 right-5">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
  <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
      Admin Dashboard
    </h2>

    <div className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Doctor Name
        </label>
        <input
          type="text"
          placeholder="Enter doctor name"
          onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Specialization
        </label>
        <input
          type="text"
          placeholder="Enter specialization"
          onChange={(e) =>
            setDoctor({ ...doctor, specialization: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        onClick={addDoctor}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
      >
        Add Doctor
      </button>

    </div>
  </div>
</div>

  );
}

export default Admin;