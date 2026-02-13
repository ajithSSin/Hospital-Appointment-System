import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Doctor() {
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate=useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/doctor-appointments", {
      headers: { Authorization: user.token }
    }).then(res => setAppointments(res.data));
  }, []);

  const update = async (id, status) => {
    await axios.put(
      `http://localhost:5000/update-status/${id}`,
      { status },
      { headers: { Authorization: user.token } }
    );
    alert("Updated");
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
    <div className="min-h-screen bg-gray-100  ">
      
      <div className="absolute top-5 left-5">
        <button
          onClick={goBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </div>

      <div className="absolute top-5 right-5 ">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
     

  <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">

    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      Doctor Dashboard
    </h2>

    <div className="space-y-6">
      {appointments.length === 0 ? (
        <p className="text-center text-gray-500">
          No appointments available.
        </p>
      ) : (
        appointments.map((a) => (
          <div
            key={a._id}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300 bg-gray-50"
          >
            <div className="flex justify-between items-center">

              {/* Appointment Info */}
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  📅 {a.date}
                </p>
                <p className="text-gray-600">⏰ {a.time}</p>
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

            {/* Action Buttons */}
            {a.status !== "Completed" && a.status !== "Cancelled" && (
              <div className="mt-4 flex gap-3">
                {a.status === "Pending" && (
                  <button
                    onClick={() => update(a._id, "Accepted")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Accept
                  </button>
                )}

                {a.status === "Accepted" && (
                  <button
                    onClick={() => update(a._id, "Completed")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                  >
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