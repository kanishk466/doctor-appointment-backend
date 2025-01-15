
import mongoose  from "mongoose";


const doctorAvailabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    availableSlots: [
      {
        date: { type: Date, required: true },
        timeSlots: [
          {
            startTime: { type: String, required: true }, // e.g., "10:00 AM"
            endTime: { type: String, required: true },   // e.g., "10:30 AM"
          }
        ],
      }
    ],
  }, { timestamps: true });
  
  export default mongoose.model("DoctorAvailability", doctorAvailabilitySchema);
  