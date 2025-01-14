import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs"
import express from "express"
import path from "path";



dotenv.config();

express().set("view engine" , 'ejs');


export const sendTaskAssignmentEmail = async (email, { subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  });
};
