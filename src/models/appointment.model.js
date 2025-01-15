import mongoose  from "mongoose";


const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  appointmentDate: { 
    type: Date, 
    required: true, 
    },
  notes: { type: String },
  reasonNotes: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
}, { timestamps: true });


export default mongoose.model('Appointment', appointmentSchema);


