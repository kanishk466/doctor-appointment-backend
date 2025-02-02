import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    slots: [{
        startTime: { type: String, required: true }, // Format: HH:mm
        endTime: { type: String, required: true },   // Format: HH:mm
        isBooked: { type: Boolean, default: false }
    }]
});

export default mongoose.model('Availability', AvailabilitySchema);
