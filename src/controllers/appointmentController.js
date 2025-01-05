import Appointment from "../models/appointment.model.js"
import User from "../models/user.model.js"



export const bookAppointment = async (req, res) => {
  const { doctorId,patientId, appointmentDate, notes, reasonNotes } = req.body;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") return res.status(400).send("Invalid doctor ID.");

    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      notes,
      reasonNotes,
    });

    await appointment.save();
    res.status(201).send("Appointment booked successfully!");
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error });
  }
};




 export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
    .populate("doctorId", "name email")
    .populate("patientId", "personalInformation.name personalInformation.email")
    .sort({ appointmentDate: 1 }); // Sort by upcoming dates

    res.status(200).json({ message: "Appointments fetched successfully", data: appointments });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};



export const updateAppointmentStatus =  async (req, res) => {
  

  
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully", data: updatedAppointment });
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


export const getPateintBookedAppointment = async(req,res)=>{


  try {
      const patientId = req.params.id;
      const patient = await Appointment.findOne({ patientId }).populate('patientId doctorId', 'name email');
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
  
      res.status(200).json({ message: 'Patient fetched successfully', data: patient });
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  

}
