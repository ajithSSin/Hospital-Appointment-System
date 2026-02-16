import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    // const res = await axios.post("http://localhost:5000/login", {
    const res = await axios.post("/api/login", {
      user,
      password
    });

    if (res.data.token) {
      localStorage.setItem("user", JSON.stringify(res.data));
      console.log(res.data.userId);
      
      localStorage.setItem("userId", res.data.userId);
      navigate(`/${res.data.role}`);
    } else {
      alert(res.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <input
          type="text"
          placeholder="User Name"
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 rounded-lg 
                    hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          No account?{" "}
          <Link to="/register" 
            className="text-blue-500 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;