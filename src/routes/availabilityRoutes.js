import express from 'express';
import Availability from '../models/AvailabilitySchema.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Add availability slots (Doctor Only)
// Set doctor availability with auto-generated slots

const generateTimeSlots = (startTime, endTime, slotDuration) => {
    const slots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
        let nextTime = new Date(currentTime.getTime() + slotDuration * 60000);
        slots.push({
            startTime: currentTime.toTimeString().slice(0, 5), // HH:mm format
            endTime: nextTime.toTimeString().slice(0, 5),
            isBooked: false
        });
        currentTime = nextTime;
    }
    
    return slots;
};

router.post('/set', authenticateToken, async (req, res) => {
    try {
    console.log(req.user.role);
    
        
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const { date, startTime, endTime, slotDuration } = req.body;

        // Convert start & end time to Date objects
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        if (start >= end) {
            return res.status(400).json({ message: 'Invalid time range' });
        }

        // Generate slots dynamically
        const slots = generateTimeSlots(start, end, slotDuration);

        // Save to database
        const availability = new Availability({ 
            doctorId: req.user.id, 
            date, 
            slots 
        });

        await availability.save();
        res.status(201).json({ message: 'Availability set successfully', availability });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});




// Get available slots for a doctor
router.get('/:doctorId/:date', async (req, res) => {
   try {
        const { doctorId, date } = req.params;
        const availability = await Availability.findOne({ doctorId, date });

        if (!availability) {
            return res.json({ message: 'No slots available' });
        }

        const availableSlots = availability.slots.filter(slot => !slot.isBooked);
        res.json(availableSlots);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete availability (Doctor Only)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Doctor') {
            return res.status(403).json({ message: 'Access Denied' });
        }

        await Availability.findByIdAndDelete(req.params.id);
        res.json({ message: 'Availability deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;
