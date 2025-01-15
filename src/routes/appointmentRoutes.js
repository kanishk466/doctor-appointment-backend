import express from "express"

import {bookAppointment ,setDoctorAvailability, viewAppointments , updateAppointmentStatus , getDoctor , getPateintBookedAppointment , getDoctorSlots} from "../controllers/appointmentController.js"

import authenticate from "../middleware/authMiddleware.js"
const router = express.Router();


router.post('/', authenticate, bookAppointment);
router.get('/', authenticate, viewAppointments);

router.patch('/:id/status' , authenticate , updateAppointmentStatus);

router.get('/doctor' , authenticate , getDoctor);

router.get('/patient/:id' , authenticate , getPateintBookedAppointment);




router.get("/doctor/:doctorId/slots",authenticate, getDoctorSlots);



router.post('/set-availability', setDoctorAvailability);

export default router;
