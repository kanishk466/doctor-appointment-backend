import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendTaskAssignmentEmail = async (to, taskDetails) => {




  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: to, // List of receivers
    subject: "Appointment Booked Successfully ! ", // Subject line
    text: `You have been a new message from the Doctor Appointment System`, // Plain text body
    html: `
    <h1>Hello  ${taskDetails.patientName},</h1>
  <p>Your appointment is scheduled for  ${taskDetails.date} with Dr. ${taskDetails.doctorName}.</p>
  <p>Thank you for choosing our services!</p>
    
    
 `, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendTaskAssignmentEmail;
