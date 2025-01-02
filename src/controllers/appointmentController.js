import Appointment from "../models/appointment.model.js"
import User from "../models/user.model.js"



export const bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;

console.log(doctorId , date);
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") return res.status(400).send("Invalid doctor ID.");

    const appointment = new Appointment({
      doctorId,
      patientId: req.user.id,
      date,
    });

    await appointment.save();
    res.status(201).send("Appointment booked successfully!");
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};

 export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [{ doctorId: req.user.id }, { patientId: req.user.id }],
    }).populate("doctorId patientId", "name email");

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send("Server error.");
  }
};



export const updateAppointmentStatus =  async (req, res) => {
  const { status } = req.body;
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).send("Appointment not found.");

    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).send("You are not authorized to update this appointment.");
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({message :"Appointment status updated successfully!" , status});
  } catch (error) {
    res.status(500).send("Server error.");
  }
};



export const getDoctor = async(req,res)=>{
  try {
    // Fetch all users with the role of "doctor"
    const doctors = await User.find({ role: "doctor" }).select("name specialization email _id");

    // If no doctors found, return a 404
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    // Return the list of doctors
    return res.json(doctors);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}