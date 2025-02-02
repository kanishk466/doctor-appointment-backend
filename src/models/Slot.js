import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' }
});


SlotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });
export default mongoose.model('Slot', SlotSchema);