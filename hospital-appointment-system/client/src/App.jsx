import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Admin from "./Admin";
import Patient from "./Patient";
import Doctor from "./Doctor";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <Patient />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <Doctor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;