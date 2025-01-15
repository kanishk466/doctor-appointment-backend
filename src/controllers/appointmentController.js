import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import notificationQueue from "../jobs/notificationQueue.js"; // Bull queue setup


import DoctorAvailability from "../models/doctorAvailability.js";


// import { sendEmail } from "../services/notificationService";
// import { sendSMS } from "../services/twilioservice";

import { configDotenv } from "dotenv";
configDotenv();

// ============================Book Appointment ==============================
// export const bookAppointment = async (req, res) => {
//   const { doctorId, patientId, appointmentDate, notes, reasonNotes } = req.body;

//   try {
//     const doctor = await User.findById(doctorId);
//     if (!doctor || doctor.role !== "doctor")
//       return res.status(400).send("Invalid doctor ID.");

//     const appointment = new Appointment({
//       doctorId,
//       patientId,
//       appointmentDate,
//       notes,
//       reasonNotes,
//     });

//     await appointment.save();

//     // Fetch patient details
//     const patient = await Patient.findById(patientId);
//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     // Prepare task details

//        const doctorName = doctor.name
//        const patientName = patient.personalInformation.name
//        const patientEmail = patient.personalInformation.email
//        const patientPhone = patient.personalInformation.phone
       
    


//     if (!patientEmail || !patientPhone) {
//       return res
//         .status(400)
//         .json({ message: "Patient contact information is incomplete." });
//     }

//     // Add email and SMS notifications to the queue
//     notificationQueue.add("email", {
//       email: patientEmail,
//       subject: "Appointment Confirmation",
//       message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} has been confirmed.`,
//     });

//     notificationQueue.add("sms", {
//       phone: `+91${patientPhone}`,
//       message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${appointmentDate} has been confirmed.`,
//     });

//     // let email = null;
//     // let taskDetails = null;

//     // const patient = await Appointment.find({ patientId })
//     //   .populate("doctorId", "name email ")
//     //   .populate(
//     //     "patientId",
//     //     "personalInformation.name personalInformation.email personalInformation.phone"
//     //   );
//     // if (!patient) {
//     //   return res.status(404).json({ message: "Patient not found" });
//     // } else {
//     //   email = patient[0].patientId.personalInformation.email;

//     //   taskDetails = {
//     //     date: appointmentDate,
//     //     doctorName: patient[0].doctorId.name,
//     //     patientName: patient[0].patientId.personalInformation.name,
//     //     patientPhone: patient[0].patientId.personalInformation.phone,
//     //   };
//     // }

//     res
//       .status(201)
//       .json({ message: "Appointments Booked successfully", appointment });
//   } catch (error) {
//     res.status(500).json({ message: "Error booking appointment", error });
//   }
// };









 export const bookAppointment = async (req, res) => {
  const { doctorId, patientId, appointmentDate } = req.body;

  try {
    const parsedDate = new Date(appointmentDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid appointment date format." });
    }


        const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(400).send("Invalid doctor ID.");



    // Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: parsedDate,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Slot is already booked." });
    }

    // Create a new appointment
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate: parsedDate,
    });

    await newAppointment.save();


    //     // Fetch patient details
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Prepare task details

       const doctorName = doctor.name
       const patientName = patient.personalInformation.name
       const patientEmail = patient.personalInformation.email
       const patientPhone = patient.personalInformation.phone




    if (!patientEmail || !patientPhone) {
      return res
        .status(400)
        .json({ message: "Patient contact information is incomplete." });
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







    res.status(201).json({ message: "Appointment booked successfully.", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


//========================================setDoctorAvailability=================




export const setDoctorAvailability = async (req, res) => {
  const { doctorId, availableSlots } = req.body;

  try {
    const existingAvailability = await DoctorAvailability.findOne({ doctorId });

    if (existingAvailability) {
      existingAvailability.availableSlots = availableSlots;
      await existingAvailability.save();
    } else {
      const newAvailability = new DoctorAvailability({ doctorId, availableSlots });
      await newAvailability.save();
    }

    res.status(200).json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error setting availability:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


// ==================================view appointment all===========================

export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name email")
      .populate(
        "patientId",
        "personalInformation.name personalInformation.email"
      )
      .sort({ appointmentDate: 1 }); // Sort by upcoming dates

    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};
//=================================getDoctorSlots==================






export const getDoctorSlots = async (req, res) => {
  // const { doctorId, date } = req.query;

    const { doctorId } = req.params;
  const { date } = req.query;

  try {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const availability = await DoctorAvailability.findOne({
      doctorId,
      "availableSlots.date": parsedDate,
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found for this date." });
    }

    // Fetch all booked slots for this doctor and date
    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: parsedDate, $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000) },
    }).select("appointmentDate");

    // Mark booked slots
    const bookedSlots = bookedAppointments.map((appt) => appt.appointmentDate.getTime());

    // Filter available slots
    const availableSlots = availability.availableSlots.filter(
      (slot) =>
        !bookedSlots.includes(new Date(slot.start).getTime()) &&
        !bookedSlots.includes(new Date(slot.end).getTime())
    );

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};













//==========================update Appointment Status====================================

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

    res.status(200).json({
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).send("Server error.");
  }
};

//====================================Get Doctor ====================================
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

//=======================================GEt Patient Booked appointment ====================
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
