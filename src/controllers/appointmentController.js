import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js"
import notificationQueue from "../jobs/notificationQueue.js"; // Bull queue setup


// import { sendEmail } from "../services/notificationService";
// import { sendSMS } from "../services/twilioservice";


import { configDotenv } from "dotenv";
configDotenv();



//  Book Appointment
export const bookAppointment = async (req, res) => {



  const { doctorId, patientId, appointmentDate, notes, reasonNotes } = req.body;

  try {
    const doctor = await User.findById(doctorId);


    if (!doctor || doctor.role !== "doctor")
      return res.status(400).send("Invalid doctor ID.");

    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate,
      notes,
      reasonNotes,
    });


    await appointment.save();



 // Fetch patient details
 const patient = await Patient.findById(patientId);
 if (!patient) {
   return res.status(404).json({ message: "Patient not found" });
 }




 // Prepare task details
   const doctorName = doctor.name;
    const patientName = patient.personalInformation.name;
    const patientEmail = patient.personalInformation.email;
    const patientPhone = patient.personalInformation.phone;

 if (!patientEmail || !patientPhone) {
  return res.status(400).json({ message: "Patient contact information is incomplete." });
}

// Add email and SMS notifications to the queue
notificationQueue.add("email", {
  email: patientEmail,
  subject: "Appointment Confirmation",
  message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} has been confirmed.`,
});

notificationQueue.add("sms", {
  phone: `+91${patientPhone}`,
  message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} has been confirmed.`,
});

    // let email = null;
    // let taskDetails = null;

    // const patient = await Appointment.find({ patientId })
    //   .populate("doctorId", "name email ")
    //   .populate(
    //     "patientId",
    //     "personalInformation.name personalInformation.email personalInformation.phone"
    //   );
    // if (!patient) {
    //   return res.status(404).json({ message: "Patient not found" });
    // } else {
    //   email = patient[0].patientId.personalInformation.email;

    //   taskDetails = {
    //     date: appointmentDate,
    //     doctorName: patient[0].doctorId.name,
    //     patientName: patient[0].patientId.personalInformation.name,
    //     patientPhone: patient[0].patientId.personalInformation.phone,
    //   };
    // }



    res.status(201).json({ message: "Appointments Booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

// view appointment all

export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name email")
      .populate(
        "patientId",
        "personalInformation.name personalInformation.email"
      )
      .sort({ appointmentDate: 1 }); // Sort by upcoming dates

    res
      .status(200)
      .json({
        message: "Appointments fetched successfully",
        data: appointments,
      });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};






export const updateAppointmentStatus = async (req, res) => {
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

    res
      .status(200)
      .json({
        message: "Appointment updated successfully",
        data: updatedAppointment,
      });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};

export const getDoctor = async (req, res) => {
  try {
    // Fetch all users with the role of "doctor"
    const doctors = await User.find({ role: "doctor" }).select(
      "name specialization email _id"
    );

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
};

export const getPateintBookedAppointment = async (req, res) => {
  try {
    const patientId = req.params.id;
    const patient = await Appointment.find({ patientId }).populate(
      "patientId doctorId",
      "name email"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res
      .status(200)
      .json({ message: "Patient fetched successfully", data: patient });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
