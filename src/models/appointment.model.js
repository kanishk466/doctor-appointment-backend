import mongoose  from "mongoose";


const appointmentSchema = new mongoose.Schema({
 doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed"], default: "pending" },
  }, { timestamps: true });
  
  

export default mongoose.model('Appointment', appointmentSchema);


