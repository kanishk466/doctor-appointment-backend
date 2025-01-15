import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import express from "express";
import path from "path";

dotenv.config();

express().set("view engine", "ejs");

export const sendTaskAssignmentEmail = async (email, { subject, message }) => {


 
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // const defaultNotes = [
  //   "Please arrive 15 minutes before your appointment",
  //   "Bring your insurance card and ID",
  //   "Wear a mask during your visit",
  // ];

  // const templateData = {
  //   doctorName: message.doctorName,
  //   patientName: message.patientName,
  //   patientEmail: message.patientEmail,
  //   patientPhone: message.patientPhone,
  //   importantNotes: defaultNotes,
  // };

//   // Create plain text version
//   const plainText = `
//  Hello ${templateData.patientName},
 
//  Your appointment has been confirmed!
 
//    Appointment Details:
//       Doctor: Dr. ${templateData.doctorName}
//       Date: ${templateData.appointmentDate}

//            Important Notes:
//       ${templateData.importantNotes.join("\n")}
 
 

// `;



  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  });
};
