import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import notificationQueue from "../jobs/notificationQueue.js"; // Bull queue setup

import Availability from '../models/AvailabilitySchema.js';

import { configDotenv } from "dotenv";
configDotenv();

// ============================Book Appointment ==============================

// export const bookAppointment = async (req, res) => {
//   try {
//     const { doctorId, patientId, date, startTime, endTime } = req.body;

//     for (let attempt = 0; attempt < 3; attempt++) {
//       try {
//         const appointment = new Appointment({ ...req.body });

//         const doctor = await User.findById(doctorId);
//     if (!doctor || doctor.role !== "doctor")
//       return res.status(400).send("Invalid doctor ID.");


//     const patient = await Patient.findById(patientId);
//     if (!patient) {
//       return res.status(404).json({ message: "Patient not found" });
//     }


//         await appointment.save();


//                const doctorName = doctor.name
//        const patientName = patient.personalInformation.name
//        const patientEmail = patient.personalInformation.email
//        const patientPhone = patient.personalInformation.phone

//            notificationQueue.add("email", {
//       email: patientEmail,
//       subject: "Appointment Confirmation",
//       message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} has been confirmed.`,
//     });

//     notificationQueue.add("sms", {
//       phone: `+91${patientPhone}`,
//       message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} has been confirmed.`,
//     });


        
//         return res.status(201).json(appointment);
//       } catch (error) {
//         if (error.code === 11000) {
//           // Duplicate slot booking
//           if (attempt === 2)
//             return res
//               .status(400)
//               .json({
//                 message:
//                   "Slot already booked. Please select another time slot.",
//               });
//         } else {
//           throw error;
//         }
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

export const bookAppointment = async (req,res)=>{

  try {
    const { doctorId, patientId,date, startTime, endTime } = req.body;

    // Convert date to ISO format for correct comparisons
    const appointmentDate = new Date(date).toISOString().split('T')[0];

    // Check if an appointment exists at the same time slot
    const existingAppointment = await Appointment.findOne({
        doctorId,
        date: new Date(appointmentDate),
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    if (existingAppointment) {
        return res.status(400).json({ message: 'Slot already booked' });
    }

    // Create new appointment
    const appointment = new Appointment({ 
        doctorId, 
        patientId, 
        date: new Date(appointmentDate), 
        startTime, 
        endTime 
    });

        const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor")
      return res.status(400).send("Invalid doctor ID.");


    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }


    await appointment.save();


  // Step 2: Update the corresponding slot to set isBooked = true
    const updatedAvailability = await Availability.findOneAndUpdate(
      {
        doctorId,
        date: appointmentDate,
        "slots.startTime": startTime,
        "slots.endTime": endTime,
      },
      {
        $set: { "slots.$.isBooked": true },
      },
      { new: true }
    );

    if (!updatedAvailability) {
      return res.status(400).json({ message: "Failed to update slot booking" });
    }

          
               const doctorName = doctor.name
       const patientName = patient.personalInformation.name
       const patientEmail = patient.personalInformation.email
       const patientPhone = patient.personalInformation.phone

           notificationQueue.add("email", {
      email: patientEmail,
      subject: "Appointment Confirmation",
      message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} has been confirmed.`,
    });

    notificationQueue.add("sms", {
      phone: `+91${patientPhone}`,
      message: `Dear ${patientName}, your appointment with Dr. ${doctorName} on ${date} has been confirmed.`,
    });


    res.status(201).json(appointment);
} catch (error) {
    res.status(500).json({ message: 'Server Error', error });
}


}




// ==================================view appointment all===========================

export const viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name email")
      .populate(
        "patientId"
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
