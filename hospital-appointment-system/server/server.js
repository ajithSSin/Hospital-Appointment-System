
import express from "express"
import mongoose from "mongoose"

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import cors from "cors"


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/hospital");

// ================== MODELS ==================

// USER MODEL
const userSchema = new mongoose.Schema({
  name: String,
  user: String,
  password: String,
  role: String // admin | doctor | patient
});
const User = mongoose.model("User", userSchema);

// DOCTOR MODEL
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String
});
const Doctor = mongoose.model("Doctor", doctorSchema);

// APPOINTMENT MODEL
const appointmentSchema = new mongoose.Schema({
  patientId: String,
  doctorId: String,
  date: String,
  time: String,
  status: {
    type: String,
    default: "Pending"
  }
});
const Appointment = mongoose.model("Appointment", appointmentSchema);

// ================== MIDDLEWARE ==================

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.json({ message: "Login required" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.result = decoded;
    next();
  } catch {
    res.json({ message: "Invalid token" });
  }
}

function checkRole(role) {
  return function (req, res, next) {
    if (req.result.role !== role) {
      return res.json({ message: "Access denied" });
    }
    next();
  };
}

// ================== AUTH ROUTES ==================

// Register
app.post("/register", async (req, res) => {
  const { name, user, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const result = await User.create({
    name,
    user,
    password: hashed,
    role
  });

  res.json(result);
});

// Login
app.post("/login", async (req, res) => {
  const { user, password } = req.body;

  const result = await User.findOne({ user });
  if (!result) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, result.password);
  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: result._id, role: result.role },
    "secretkey"
  );
  console.log("token",token);
  
  res.json({ token, role: result.role });
});

// ================== ADMIN ROUTES ==================

// Add Doctor (Admin only)
app.post("/add-doctor", auth, checkRole("admin"), async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

// ================== PATIENT ROUTES ==================

// Book Appointment
app.post("/book", auth, checkRole("patient"), async (req, res) => {
  const { doctorId, date, time } = req.body;

  // Prevent double booking
  const exists = await Appointment.findOne({
    doctorId,
    date,
    time,
    status: { $in: ["Pending", "Accepted"] }
  });

  if (exists) {
    return res.json({ message: "Slot already booked" });
  }

  const appointment = await Appointment.create({
    patientId: req.result.id,
    doctorId,
    date,
    time
  });

  res.json(appointment);
});

// Cancel Appointment (Patient)
app.put("/cancel/:id", auth, checkRole("patient"), async (req, res) => {
  await Appointment.findByIdAndUpdate(req.params.id, {
    status: "Cancelled"
  });

  res.json({ message: "Cancelled" });
});

// ================== DOCTOR ROUTES ==================

// View Appointments
app.get("/doctor-appointments", auth, checkRole("doctor"), async (req, res) => {
  const appointments = await Appointment.find();
  res.json(appointments);
});

// Update Status
app.put("/update-status/:id", auth, checkRole("doctor"), async (req, res) => {
  const { status } = req.body;

  await Appointment.findByIdAndUpdate(req.params.id, { status });

  res.json({ message: "Status Updated" });
});

// ================== VIEW ROUTES ==================

// View All Doctors
app.get("/doctors", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// View My Appointments (Patient)
app.get("/my-appointments", auth, checkRole("patient"), async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.result.id
  });

  res.json(appointments);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
